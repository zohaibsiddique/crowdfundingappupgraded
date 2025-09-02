
import { TransactionResponse } from "ethers";
import { Campaign } from "./campaign";

export interface FactoryContract {
    getUserCampaigns(userAddress: string): Promise<Campaign[]>;
    getAllCampaigns(): Promise<Campaign[]>;
    createCampaign(
        name: string,
        description: string,
        minGoal: bigint,
        maxGoal: bigint,
        durationInDays: number
    ): Promise<void>;
    togglePause(): Promise<TransactionResponse>;
    owner(): Promise<string>;
    paused(): Promise<boolean>;


}