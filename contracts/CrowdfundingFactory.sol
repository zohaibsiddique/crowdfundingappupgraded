// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Crowdfunding} from "./Crowdfunding.sol";

import "hardhat/console.sol";

contract CrowdfundingFactory {
    address public owner;
    bool public paused;

    struct Campaign {
        address campaignAddress;
        address owner;
        string name;
        uint256 creationTime;
    }

    Campaign[] public campaigns;
    mapping(address => Campaign[]) public userCampaigns;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner.");
        _;
    }

    modifier notPaused() {
        require(!paused, "Factory is paused");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _minGoal,
        uint256 _maxGoal,
        uint256 _durationInDays
    ) external notPaused {
        require(_minGoal > 0, "Minimum goal must be > 0");
        require(_maxGoal >= _minGoal, "Max goal must be >= min goal");

        Crowdfunding newCampaign = new Crowdfunding(
            msg.sender,
            _name,
            _description,
            _minGoal,
            _maxGoal,
            _durationInDays
        );

        address campaignAddress = address(newCampaign);

        Campaign memory campaign = Campaign({
            campaignAddress: campaignAddress,
            owner: msg.sender,
            name: _name,
            creationTime: block.timestamp
        });

        campaigns.push(campaign);
        userCampaigns[msg.sender].push(campaign);
    }

    function getUserCampaigns(address _user) external view returns (Campaign[] memory) {
        return userCampaigns[_user];
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

    function togglePause() external onlyOwner {
        paused = !paused;
    }
}
