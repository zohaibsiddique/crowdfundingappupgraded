import { Tier } from "./tier";

export interface Campaign {
  campaignAddress: string;
  owner: string;
  name: string;
  creationTime?: number; // Unix timestamp
  paused?: boolean;
  tiers?: Tier[];
  balance?: bigint; // Balance in wei
  maxGoal?: bigint; // Maximum goal in wei
  minGoal?: bigint; // Minimum goal in wei
  state?: number; // 0: Active, 1: Successful, 2: Failed, 3: Withdrawn
  description: string;
  myContributon?: string; // My contribution in wei
  deadline?: bigint; // Deadline in Unix timestamp
}