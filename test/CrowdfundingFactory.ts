import { expect } from "chai";
import { parseEther } from "ethers";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("CrowdfundingFactory", function () {
  let factory: any;
  let owner: any;
  let user: any;

  it("Should emit the Increment event when calling the inc() function", async function () {
    const [ownerSigner, userSigner] = await ethers.getSigners();
    owner = ownerSigner;
    user = userSigner;
    factory = await ethers.deployContract("CrowdfundingFactory", owner);
  });

  it("should deploy the factory contract", async () => {
    expect(factory.target).to.match(/^0x[a-fA-F0-9]{40}$/);
  });

  it("should deploy with correct owner", async () => {
    const deployedOwner = await factory.runner.address;
    expect(deployedOwner).to.equal(owner.address);
  });

  it("should create a campaign", async () => {
    
    const txHash = await factory.connect(user).createCampaign(
      "Test Campaign",
      "A test description",
      parseEther("1"),
      parseEther("5"),
      30
    );

    const receipt = await txHash.wait();

    const allCampaigns = await factory.getAllCampaigns();
    expect(allCampaigns.length).to.equal(1);

    const userCampaigns = await factory.getUserCampaigns(user.address);
    expect(userCampaigns.length).to.equal(1);
    expect(userCampaigns[0].name).to.equal("Test Campaign");
  });

  it("should toggle pause and prevent campaign creation", async () => {
    // Toggle pause using the owner signer
    const tx = await factory.connect(owner).togglePause();
    await tx.wait();

    // Check paused state
    const paused = await factory.getPaused();
    expect(paused).to.equal(true);

    // Try to create a campaign while paused
    await expect(
      factory.connect(user).createCampaign(
        "Paused Campaign",
        "Should fail",
        parseEther("1"),
        parseEther("5"),
        30
      )
    ).to.be.revertedWith("Factory is paused");
  });
});