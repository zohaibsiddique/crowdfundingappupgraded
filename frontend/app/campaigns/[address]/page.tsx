'use client'
import { connectCrowdfundingContract } from '@/app/contract-utils/connect-crowdfunding-contract';
import { CrowdfundingContract } from '@/app/contract-utils/interfaces/crowdfunding-contract';
import { Campaign } from '@/app/contract-utils/interfaces/campaign';
import { Tier } from '@/app/contract-utils/interfaces/tier';
import NavBarCampaigns from '@/components/nav-bar-campaigns';
import TiersSection from '@/components/tiers-section';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { toast } from "sonner"
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import CampaignSkeleton from '@/components/campaign-skeleton';
import { Anybody } from 'next/font/google';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers';
import { getContract } from 'viem'
import { CROWDFUNDING_FACTORY_ABI, CROWDFUNDING_FACTORY_ADDRESS } from "../../contract-utils/crowdfundingfactory-abi";

const CampaignPage = () => {
    const params = useParams();
    const campaignAddress = params?.address as string | undefined;

    if (!campaignAddress) {
        return <div>Loading...</div>;
    }

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddTierForm, setShowAddTierForm] = useState(false);
    const [progress, setProgress] = useState<string>("");
    const [paused, setPaused] = useState<boolean | null>(null);
    const [contract, setContract] = useState<CrowdfundingContract | null>(null);
    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient()

    const [form, setForm] = useState({
        name: "",
        amount: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    useEffect(() => {

        const init = async () => {
            try {
                fetchData();
            } catch (err) {
                console.error("Error initializing contract:", err);
            }
        };

        if (address) {
            init();
        }

    }, [address, isConnected]);

    const fetchData = async () => {

        if (!walletClient) return;

        const crowdfundingContract = getContract({
                address: campaignAddress as `0x${string}`,
                abi: CROWDFUNDING_FACTORY_ABI,
                client: walletClient,
              })

        // const crowdfundingContract = await connectCrowdfundingContract(campaignAddress);
        console.log(crowdfundingContract)
        setContract(crowdfundingContract as unknown as CrowdfundingContract);
        
        try {
            setLoading(true);
            setCampaign(null); // Reset campaign before fetching

            const name = await crowdfundingContract.read.name() as unknown as string;
            const description = await crowdfundingContract.read.description() as string;
            const minGoal = await crowdfundingContract.read.minGoal() as bigint;
            const maxGoal = await crowdfundingContract.read.maxGoal() as bigint;
            const deadline = await crowdfundingContract.read.deadline() as bigint;
            const owner = await crowdfundingContract.read.owner() as string;
            const paused = await crowdfundingContract.read.paused() as boolean;
            const tiers = await crowdfundingContract.read.getTiers() as Tier[];
            const state = await crowdfundingContract.read.state() as number;
            const balance = await crowdfundingContract.read.getContractBalance() as bigint;
            const myContribution = await crowdfundingContract.read.getBackerContribution([address!]) as bigint;            
            const formattedTiers = tiers.map((tier: Tier, idx: number) => ({
                index: idx,
                id: tier.id,
                name: tier.name.toString(),
                amount: tier.amount,
                backers: tier.backers,
            }));
            const campaign: Campaign = {
                campaignAddress,
                owner,
                name,
                description,
                minGoal,
                maxGoal,
                deadline,
                paused,
                tiers: formattedTiers,
                state,
                balance,
                myContributon: myContribution.toString(),
                };
                
            // Set the campaign state with the fetched data
            setCampaign(campaign);

        } catch (err) {
            console.error("Error fetching campaigns:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        let isMounted = true;
        setProgress("Connecting to contract...");
    
        try {
          if (!isMounted) return;
    
          setProgress("Adding Tier...");

          if (!contract) throw new Error("Contract not connected");
          const tx = await contract.addTier(
            form.name,
            BigInt(form.amount),
          );
          await tx.wait(); // wait for tx to confirm

          if (!isMounted) return;
    
          toast.success("Tier added successfully!")
          setShowAddTierForm(false)
          setTimeout(() => setProgress(""), 1500); // Auto close dialog after success

          fetchData(); // Refresh campaign data after adding tier
        } catch (error: any) {
          if (!isMounted) return;
          toast.error(error.reason || "Failed to add tier.")
          setTimeout(() => setProgress(""), 2500); // Auto close dialog after error
        }
    
        return () => {
          isMounted = false;
        };
      };

    const fund = async (tierIndex: number) => {
        if (!campaignAddress || !Array.isArray(campaign?.tiers)) return;
        try {
            setProgress("Connecting to contract..." );
            const tier = campaign?.tiers[tierIndex];
            if (!tier) throw new Error("Tier not found");
            setProgress("Sending funds...");
            const tx = await contract?.fund(tierIndex, { value: tier.amount });
            await tx.wait();

            toast.success("Funded successfully!")
            setTimeout(() => setProgress(""), 1500);

            fetchData(); // Refresh campaign data after funding
        } catch (error: any) {
            toast.error(error.reason || "Failed to fund tier.")
            setTimeout(() => setProgress(""), 2500);
        }
    };

    const removeTier = async (tierIndex: number) => {
        if (!campaignAddress || !Array.isArray(campaign?.tiers)) return;
        try {
            setProgress("Connecting to contract...");
            const tier = campaign.tiers[tierIndex];
            if (!tier) throw new Error("Tier not found");
            setProgress("Removing Tier");
            const tx = await contract?.removeTier(tierIndex);
            await tx.wait();

            toast.success("Tier removed")
            setTimeout(() => setProgress(""), 1500);

            fetchData(); // Refresh campaign data after removing tier
        } catch (error: any) {
            toast.error(error.reason || "Failed to remove Tier.")
            setTimeout(() => setProgress(""), 2500);
        }
    };

    const getProgress = () => {
      const progress = (Number(campaign?.balance) / Number(campaign?.maxGoal)) * 100;
       return Math.min(progress, 100); // Ensure it doesn’t exceed 100%
    };

    const handleWithdraw = async () => {
        if (!campaignAddress) return;
        try {
            setProgress("Connecting to contract...");
            setProgress("Withdrawing funds...");
            const tx = await contract?.withdraw();
            await tx.wait();

            toast.success("Withdraw successfully!")
            setTimeout(() => setProgress(""), 1500);
        } catch (error: any) {
            toast.error(error.reason || "Failed to withdraw fund.")
            setTimeout(() => setProgress(""), 2500);
        }
    };

    const handleRefund = async () => {
        if (!campaignAddress) return;
        try {
            setProgress("Connecting to contract...");
            setProgress("Refunding...");
            const tx = await contract?.refund();
            await tx.wait();

            toast.success("Refund successfull!")
            setTimeout(() => setProgress(""), 1500);
        } catch (error: any) {
            toast.error(error.reason || "Failed to refund fund.")
            setTimeout(() => setProgress(""), 2500);
        }
    };

    // Toggle handler
    const togglePause = async () => {
        if (!contract) return;
        try {
            const tx = await contract.togglePause();
            await tx.wait(); // wait for tx to confirm
            const pauseState = await contract.paused();
            setPaused(pauseState);
        } catch (error: any) {
            toast.error(error.reason || "Failed to toggle.")
        }
    };

    const isOwner = () => address?.toLowerCase() === campaign?.owner?.toLowerCase();

    return (
        <>
            <NavBarCampaigns />

            <Dialog open={!!progress} onOpenChange={() => setProgress("")}>
                <DialogContent className="sm:max-w-md text-center">
                <DialogHeader>
                    <DialogTitle>Processing</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center gap-4 py-6">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <p className="text-sm text-muted-foreground">{progress}</p>
                </div>
                </DialogContent>
            </Dialog>

            
            {loading ? (
                    <CampaignSkeleton/>
                ) : (

                <div className="max-w-xl mx-auto my-4 ">
                    
                    {isOwner() && (campaign?.state == 1 || campaign?.state == 1) && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded mb-4" role="alert">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <strong className="font-bold">🎉 Congratulations! </strong>
                                <span>Your campaign has been successful. You can now withdraw your funds.</span>
                            </div>

                            <Button
                                onClick={handleWithdraw}
                                className="bg-green-500 hover:bg-green-700 text-white"
                            >
                                Withdraw
                            </Button>
                            </div>
                        </div>
                    )}

                    {campaign?.state == 2 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded mb-4" role="alert">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <strong className="font-bold">😞 Campaign Failed. </strong>
                                <span>You can now request a refund of your contribution.</span>
                            </div>

                            <Button
                                onClick={handleRefund}
                                className="bg-red-500 hover:bg-red-700 text-white"
                            >
                                Refund
                            </Button>
                            </div>
                        </div>
                    )}

                    
                    <div className="w-fit mx-auto border border-gray-300 rounded-md p-4 my-4 text-center">
                        <span className="block text-sm text-gray-700">Balance</span>
                        <span className=" text-lg font-bold">
                            {campaign?.balance ? ethers.formatEther(campaign.balance) : "0"} ETH
                        </span>
                    </div>
                   
                    <div className="flex justify-between">
                        <div>
                            <strong>{campaign?.name}</strong>
                            <div className="break-all text-gray-600">{campaign?.description}</div>
                        </div>
                        {isOwner() && (
                            <div className="flex gap-2">
                                <span className="text-sm">{paused ? "Paused" : "Active"}</span>
                                <Switch checked={!paused} onCheckedChange={togglePause} />
                            </div>
                        )}
                    </div>
                    

                    <div className="text-xs text-muted-foreground text-right">
                        {Number(campaign?.balance)} / {Number(campaign?.maxGoal)}
                    </div>
                    <Progress value={getProgress()} />

                    <div className='mt-2'>
                        <span className='mr-4'>Minimum Goal:</span>
                        <span className="">{campaign?.minGoal ? ethers.formatEther(campaign.minGoal) : "0"} ETH</span>
                    </div>

                    <div className='mt-2'>
                        <span className='mr-4'>Maximum Goal:</span>
                        <span className="  ">{campaign?.maxGoal ? ethers.formatEther(campaign.maxGoal) : "0"} ETH</span>
                    </div>

                        <div className='mt-2'>
                        <span className='mr-2'>Deadline:</span>
                        <span className="">
                            {new Date(Number(campaign?.deadline) * 1000).toLocaleString()}
                        </span>
                    </div>


                    <TiersSection
                        tiers={campaign?.tiers || []}
                        state={campaign?.state?.toString() || "0"}
                        progress={progress}
                        fund={fund}
                        isOwner={isOwner()}
                        removeTier = {removeTier}
                        showAddTierForm={showAddTierForm}
                        setShowAddTierForm={setShowAddTierForm}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                    />
                </div>
            )}
        </>
        
    );
};

export default CampaignPage;