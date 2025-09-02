'use client';

import NavBarCampaigns from '@/components/nav-bar-campaigns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import AllCampaigns from '@/components/all-campaigns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useAccount, usePublicClient } from 'wagmi';
import { useWalletClient } from 'wagmi'
import { CROWDFUNDING_FACTORY_ABI, CROWDFUNDING_FACTORY_ADDRESS } from "../contract-utils/crowdfundingfactory-abi";
import { getContract } from 'viem';

export default function CampaignsPage() {
  
  const [isPaused, setIsPaused] = useState<boolean | null>(null);
  const { address } = useAccount();
  const [owner, setOwner] = useState<string | null>(null);
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
   
   useEffect(() => {

      const init = async () => {
        try {

          console.log("Initializing contract...");

          if (!publicClient) return;

          console.log("public client available:", publicClient);
          
          const contract = getContract({
                  address: CROWDFUNDING_FACTORY_ADDRESS,
                  abi: CROWDFUNDING_FACTORY_ABI,
                  client: publicClient,
                })

          console.log("Wallet chain ID:", publicClient.chain.id);
          console.log("Contract address:", CROWDFUNDING_FACTORY_ADDRESS);
          console.log("ABI includes owner():", CROWDFUNDING_FACTORY_ABI.some(fn => fn.name === "owner"));

          const isPaused = await contract.read.getPaused() as boolean;
          console.log("Contract paused state:", isPaused);

          const owner = await contract.read.getOwner() as string;
          console.log("Factory Owner:", owner);

          setOwner(owner);
          setIsPaused(isPaused);

        } catch (err) {
          console.error("Error initializing contract:", err);
        }
      };
      init();
    }, []);

     // Toggle handler
  const togglePause = async () => {
    if (!walletClient) return;

    const contract = getContract({  
      address: CROWDFUNDING_FACTORY_ADDRESS,
      abi: CROWDFUNDING_FACTORY_ABI,
      client: walletClient,
    });
    if (!contract) return;

    try {
      const txHash = await contract.write.togglePause();
      console.log("Transaction hash:", txHash); 
      // Wait for transaction confirmation
      await publicClient?.waitForTransactionReceipt({ hash: txHash});
      // Update paused state
       const isPaused = await contract.read.getPaused() as boolean;
      setIsPaused(isPaused);
      console.log("Updated paused state:", isPaused);
    } catch (err) {
      console.error("Error toggling pause:", err);
    }
  };


  return (
    <div className="min-h-screen">
      {/* --- Nav bar --- */}
      <NavBarCampaigns/>
       
        <Tabs defaultValue="all" className="">
            <TabsList className="flex items-center mx-auto">
              <TabsTrigger value="all" className="justify-start">All Campaigns</TabsTrigger>
              <TabsTrigger value="my" className="justify-start">My Campaigns</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card className='border-none shadow-none'>
                <CardHeader>
                  <div className="flex flex-row justify-between">
                    <CardTitle>All Campaigns</CardTitle>
                    <div className='flex gap-6'>
                       {Boolean(address && address.toLowerCase() === owner?.toLowerCase()) && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{isPaused ? "Paused" : "Active"}</span>
                          <Switch checked={!isPaused} onCheckedChange={togglePause} />
                        </div>
                      )}
                      <Button
                        asChild
                        className="text-white bg-green-500 hover:bg-green-700"
                        disabled={isPaused === true}>
                        <Link
                          href={isPaused === true ? "#" : "/campaigns/create-campaign"}
                          aria-label="Create a new campaign"
                          aria-disabled={isPaused === true}
                          style={isPaused === true ? { pointerEvents: "none", opacity: 0.5 } : {}}
                        >
                          New Campaign
                        </Link>
                      </Button>
                     
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* <AllCampaigns/> */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my">
              <Card className='border-none shadow-none'>
                <CardHeader>
                  <div className="flex flex-row justify-between">
                    <CardTitle>My Campaigns</CardTitle>
                    <div className='flex gap-6'>
                       {Boolean(address && address.toLowerCase() === owner?.toLowerCase()) && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{isPaused ? "Paused" : "Active"}</span>
                          <Switch checked={!isPaused} onCheckedChange={togglePause} />
                        </div>
                      )}
                      <Button
                        asChild
                        className="text-white bg-green-500 hover:bg-green-700"
                        disabled={isPaused === true}>
                        <Link
                          href={isPaused === true ? "#" : "/campaigns/create-campaign"}
                          aria-label="Create a new campaign"
                          aria-disabled={isPaused === true}
                          style={isPaused === true ? { pointerEvents: "none", opacity: 0.5 } : {}}
                        >
                          New Campaign
                        </Link>
                      </Button>
                     
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* <MyCompaigns/> */}
                </CardContent>
              </Card>
            </TabsContent>

        </Tabs>
    </div>
  );
}
