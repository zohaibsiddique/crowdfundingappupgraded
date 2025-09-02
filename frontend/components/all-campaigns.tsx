'use client';

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { connectFactoryContract } from "@/app/contract-utils/connect-factory-contract";
import { ArrowRightIcon } from "lucide-react";
import { Campaign } from "@/app/utils/interfaces/campaign";
import { connectCrowdfundingContract } from "@/app/contract-utils/connect-crowdfunding-contract";
import { Progress } from "./ui/progress";
import CampaignsSkeleton from "./campaigns-skeleton";
import EmptyCampaignsMsg from "./empty-campaigns-msg";
import { ethers } from "ethers";

export default function AllCompaigns() {

  const [campaigns, setCampaigns] = useState<Campaign[]>([]); 
  const [campaignDetails, setCampaignDetails] = useState<Campaign[]>([]); 

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setCampaigns([]); // Reset campaigns before fetching
        const { contract} = await connectFactoryContract();
        const allCampaigns = await contract.getAllCampaigns();
        setCampaigns(allCampaigns);

        const campaignsData = [];
        for (let i = 0; i < allCampaigns.length; i++) {
          const crowdfundingContract = await connectCrowdfundingContract(allCampaigns[i].campaignAddress);
          const [
            name,
            description,
            minGoal,
            maxGoal,
            deadline,
            balance,
            state
          ] = await Promise.all([
            crowdfundingContract.name(),
            crowdfundingContract.description(),
            crowdfundingContract.minGoal(),
            crowdfundingContract.maxGoal(),
            crowdfundingContract.deadline(),
            crowdfundingContract.getContractBalance(),
            crowdfundingContract.getCampaignStatus()
          ]);
          campaignsData.push({
            campaignAddress: allCampaigns[i].campaignAddress,
            owner: allCampaigns[i].owner,
            name,
            description,
            minGoal: minGoal,
            maxGoal: maxGoal,
            deadline: deadline,
            balance: balance,
            state: state,
          });
          setCampaignDetails(campaignsData);
      }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []); 

  const getProgress = (campaign: Campaign) => {
    const progress = (Number(campaign?.balance) / Number(campaign?.maxGoal)) * 100;
      return Math.min(progress, 100); // Ensure it doesn’t exceed 100%
  };

  if (loading) {
    return <CampaignsSkeleton />;
  }

  if (campaigns.length === 0) {
    return <EmptyCampaignsMsg />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign, i) => {
        const details = campaignDetails[i];
        const creationTime = new Date(Number(campaign.creationTime) * 1000).toLocaleString();
        const deadline = new Date(Number(details.deadline) * 1000).toLocaleString();

        return (
          <Card key={i} className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{campaign.name}</span>
                <span className="text-xs text-gray-500 self-center">
                  {creationTime}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p>{details.description}</p>

              <div className="text-xs text-muted-foreground text-right">
                {details.balance ? ethers.formatEther(details.balance) : "0"} ETH / {details.maxGoal ? ethers.formatEther(details.maxGoal) : "0"} ETH
              </div>
              <Progress className="mt-1" value={getProgress(details)} />

              {campaign.paused ? (
                <>
                  <Button
                    className="w-full bg-blue-500 text-white mt-4"
                    disabled
                  >
                    Paused
                  </Button>
                  <span className="text-xs text-gray-500 self-center block mt-1">
                    {creationTime}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-gray-500 block mt-2">
                    Deadline: {deadline }
                  </span>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full  mt-4"
                  >
                    <a href={`/campaigns/${campaign.campaignAddress}`}>
                      <span>View Campaign</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}





