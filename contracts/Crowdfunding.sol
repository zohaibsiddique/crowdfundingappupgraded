// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "hardhat/console.sol";

contract Crowdfunding {
    string public name;
    string public description;
    uint256 public minGoal;
    uint256 public maxGoal;
    uint256 public deadline;
    address public owner;
    bool public paused;

    enum CampaignState { Active, Successful, Failed, Funded}
    CampaignState public state;

    struct Tier {
        string name;
        uint256 amount;
        uint256 backers;
    }

    struct Backer {
        uint256 totalContribution;
        mapping(uint256 => bool) fundedTiers;
    }

    Tier[] public tiers;
    mapping(address => Backer) public backers;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier campaignOpen() {
        require(state == CampaignState.Active || state == CampaignState.Funded, "Campaign is not active.");
        _;
    }

    modifier notPaused() {
        require(!paused, "Contract is paused.");
        _;
    }

    constructor(
        address _owner,
        string memory _name,
        string memory _description,
        uint256 _minGoal,
        uint256 _maxGoal,
        uint256 _durationInDays
    ) {
        require(_minGoal > 0, "Minimum goal must be > 0");
        require(_maxGoal >= _minGoal, "Max goal must be >= min goal");

        name = _name;
        description = _description;
        minGoal = _minGoal;
        maxGoal = _maxGoal;
        deadline = block.timestamp + (_durationInDays * 1 days);
        owner = _owner;
        state = CampaignState.Active;
    }

    function checkAndUpdateCampaignState() internal {
        if(state == CampaignState.Active || state == CampaignState.Funded) {
            uint256 balance = address(this).balance;

            console.log("Current balance:", balance);
            console.log("Min goal:", minGoal);
            console.log("Max goal:", maxGoal);
            console.log("current block time:", block.timestamp);
            console.log("Deadline:", deadline);
            console.log("deadline crossed:", block.timestamp >= deadline);

           if (block.timestamp >= deadline) {
                if (balance >= maxGoal) {
                    state = CampaignState.Successful;
                } else if (balance > 0) {
                    state = CampaignState.Funded;
                } else {
                    state = CampaignState.Failed;
                }
            } else {
                if (balance >= maxGoal) {
                    state = CampaignState.Successful;
                } else if (balance > 0) {
                    state = CampaignState.Funded;
                } else {
                    state = CampaignState.Active;
                }
            }
        }
    }

    function fund(uint256 _tierIndex) public payable campaignOpen notPaused {
        require(!backers[msg.sender].fundedTiers[_tierIndex], "Already funded this tier.");
        require(_tierIndex < tiers.length, "Invalid tier.");
        require(msg.value == tiers[_tierIndex].amount, "Incorrect amount.");
        require(address(this).balance <= maxGoal, "Campaign has reached its maximum goal.");

        tiers[_tierIndex].backers++;
        console.log("by backer:", msg.sender, "with amount:", msg.value);
        backers[msg.sender].totalContribution += msg.value;
        backers[msg.sender].fundedTiers[_tierIndex] = true;

        checkAndUpdateCampaignState();
    }

    function addTier(string memory _name, uint256 _amount) public onlyOwner {
        require(_amount > 0, "Amount must be greater than 0.");
        tiers.push(Tier(_name, _amount, 0));
    }

    function removeTier(uint256 _index) public onlyOwner {
        require(_index < tiers.length, "Tier does not exist.");
        tiers[_index] = tiers[tiers.length - 1];
        tiers.pop();
    }

    function withdraw() public onlyOwner {
        checkAndUpdateCampaignState();
        require(
            state == CampaignState.Successful || state == CampaignState.Funded,
            "Campaign not eligible for withdrawal."
        );
        uint256 balance = address(this).balance;
        console.log("Withdrawing balance:", balance);
        require(balance > 0, "No balance to withdraw");
        payable(owner).transfer(balance);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function refund() public {
        checkAndUpdateCampaignState();
        require(state == CampaignState.Failed, "Refunds not available.");
        uint256 amount = backers[msg.sender].totalContribution;
        uint256 balance = address(this).balance;
        console.log("Refunding amount:", amount);
        console.log("Contract balance:", balance);
        console.log("msg sender:", msg.sender);
        require(amount > 0, "No contribution to refund");
        backers[msg.sender].totalContribution = 0;
        payable(msg.sender).transfer(amount);
    }

    function hasFundedTier(address _backer, uint256 _tierIndex) public view returns (bool) {
        return backers[_backer].fundedTiers[_tierIndex];
    }

    function getTiers() public view returns (Tier[] memory) {
        return tiers;
    }

    function togglePause() public onlyOwner {
        paused = !paused;
    }

    function getCampaignStatus() public view returns (CampaignState) {
        if (state == CampaignState.Active && block.timestamp >= deadline) {
            uint256 balance = address(this).balance;
            return (balance >= minGoal && balance <= maxGoal) ? CampaignState.Successful : CampaignState.Failed;
        }
        return state;
    }

    function extendDeadline(uint256 _daysToAdd) public onlyOwner campaignOpen notPaused {
        deadline += _daysToAdd * 1 days;
    }

    function getBackerContribution(address backer) public view returns (uint256) {
        return backers[backer].totalContribution;
    }


    
}
