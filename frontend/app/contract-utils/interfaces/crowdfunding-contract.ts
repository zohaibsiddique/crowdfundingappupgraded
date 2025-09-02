/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CrowdfundingContract {
  name(): Promise<string>;
  description(): Promise<string>;
  minGoal(): Promise<bigint>;
  maxGoal(): Promise<bigint>;
  deadline(): Promise<bigint>;
  owner(): Promise<string>;
  paused(): Promise<boolean>;
  state(): Promise<number>;
  getTiers(): Promise<Array<{ name: string; amount: bigint; backers: bigint }>>;
  getContractBalance(): Promise<bigint>;
  getBackerContribution(address: string): Promise<bigint>;
  addTier(name: string, amount: bigint): Promise<any>;
  removeTier(index: number): Promise<any>;
  fund(index: number, overrides?: { value: number }): Promise<any>;
  withdraw(): Promise<any>;
  refund(): Promise<any>;
  hasFundedTier(backer: string, tierIndex: number): Promise<boolean>;
  togglePause(): Promise<any>;
  getCampaignStatus(): Promise<number>;
  extendDeadline(daysToAdd: number): Promise<any>;
}