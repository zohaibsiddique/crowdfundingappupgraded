import { expect } from "chai";
import { network } from "hardhat";
const { ethers } = await network.connect();

describe('Crowdfunding', function() {
  let crowdfunding: any;
  let owner: any;
  let user: any;
  let user2: any;

  beforeEach(async function() {
    var signers = await ethers.getSigners();
    owner = signers[0];
    user = signers[1];
    user2 = signers[2];

    crowdfunding = await ethers.getContractFactory("Crowdfunding", owner);

    crowdfunding = await crowdfunding.deploy(
      owner.address,
      'Test Campaign',
      'Test Description',
      ethers.parseEther('2'),
      ethers.parseEther('10'),
      1 // 1 day deadline
    );
    await crowdfunding.waitForDeployment(); // ensures contract is fully deployed before tests run
  });

  describe('Deployment', function() {
    it('should set correct properties', async function() {
      expect(await crowdfunding.name()).to.equal('Test Campaign');
      expect(await crowdfunding.description()).to.equal('Test Description');
      expect(await crowdfunding.minGoal()).to.equal("2000000000000000000"); // 2 ETH
      expect(await crowdfunding.maxGoal()).to.equal("10000000000000000000"); // 10 ETH
      expect(await crowdfunding.deadline()).to.be.greaterThan(0);
      expect(await crowdfunding.owner()).to.equal(owner.address);
      expect(await crowdfunding.paused()).to.equal(false);
      expect(await crowdfunding.getCampaignStatus()).to.equal(0); // Active
    });

    it('should revert if minGoal is zero', async function() {
      var Crowdfunding2 = await ethers.getContractFactory('Crowdfunding');
      await expect(
        Crowdfunding2.deploy(
          owner.address,
          'Test',
          'Test',
          0,
          ethers.parseEther('2'),
          1
        )
      ).to.be.revertedWith('Minimum goal must be > 0');
    });

    it('should revert if maxGoal < minGoal', async function() {
      var Crowdfunding2 = await ethers.getContractFactory('Crowdfunding');
      await expect(
        Crowdfunding2.deploy(
          owner.address,
          'Test',
          'Test',
          ethers.parseEther('2'),
          ethers.parseEther('1'),
          1
        )
      ).to.be.revertedWith('Max goal must be >= min goal');
    });
  });

  describe('Tiers', function() {
    it('should allow owner to add tiers', async function() {
      await crowdfunding.addTier('Tier 1', ethers.parseEther('1'));
      var tiers = await crowdfunding.getTiers();
      expect(tiers.length).to.equal(1);
      expect(tiers[0].name).to.equal('Tier 1');
    });

    it('should allow owner to remove tiers', async function() {
      await crowdfunding.addTier('Tier 1', ethers.parseEther('1'));
      await crowdfunding.removeTier(0);
      var tiers = await crowdfunding.getTiers();
      expect(tiers.length).to.equal(0);
    });

    it('should revert if non-owner adds a tier', async function() {
      await expect(
        crowdfunding.connect(user).addTier('Tier 1', ethers.parseEther('1'))
      ).to.be.revertedWith('Not the owner');
    });
  });

  describe('Funding', function() {
    beforeEach(async function() {
      await crowdfunding.addTier('Tier 1', ethers.parseEther('1'));
    });

    it('should allow funding a valid tier', async function() {
      await crowdfunding.connect(user).fund(0, { value: ethers.parseEther('1') });

      var balance = await crowdfunding.getContractBalance();
      expect(balance).to.equal(ethers.parseEther('1'));
      expect(await crowdfunding.hasFundedTier(user.address, 0)).to.equal(true);
    });

    it('should revert if amount is incorrect', async function() {
      await expect(
        crowdfunding.connect(user).fund(0, { value: ethers.parseEther('2') })
      ).to.be.revertedWith('Incorrect amount.');
    });

    it('should revert if campaign paused', async function() {
      await crowdfunding.togglePause();
      await expect(
        crowdfunding.connect(user).fund(0, { value: ethers.parseEther('1') })
      ).to.be.revertedWith('Contract is paused.');
    });
  });

  describe('Withdrawals and Refunds', function() {
    beforeEach(async function() {
      
    });

    it('should allow successful withdraw if goals met and after deadline', async function() {

      // Jump 1 day and mine
      await ethers.provider.send('evm_increaseTime', [86400]);
      await ethers.provider.send('evm_mine');
      
      await crowdfunding.addTier('Tier 1', ethers.parseEther('2'));
      await crowdfunding.connect(user).fund(0, { value: ethers.parseEther('2') });

      // Now call withdraw — this will run in the new block's timestamp
      await crowdfunding.withdraw();

      const balance = await crowdfunding.getContractBalance();
      expect(balance).to.equal(0n); // withdraw succeeded
    });


    it('should allow refund if campaign failed', async function() {
      // Increase time
      await ethers.provider.send('evm_increaseTime', [86400]);
      await ethers.provider.send('evm_mine');

      await crowdfunding.addTier('Tier 1', ethers.parseEther('1'));
      await crowdfunding.connect(user).fund(0, { value: ethers.parseEther('1') });

      // failed campaign as not enough funds raised
      await crowdfunding.connect(user).refund();
      const contribution = await crowdfunding.getBackerContribution(user.address);
      expect(contribution).to.equal(0n);
    });

    it('should not allow refund if successful', async function() {
      // Nothing withdrawn yet so goal met
      await expect(crowdfunding.connect(user).refund()).to.be.revertedWith(
        'Refunds not available.'
      );
    });
  });

  describe('Pause/Unpause and Extend', function() {
    it('should allow owner to toggle pause', async function() {
      await crowdfunding.togglePause();
      expect(await crowdfunding.paused()).to.equal(true);
    });

    it('should allow owner to extend deadline', async function() {
      var oldDeadline = await crowdfunding.deadline();
      await crowdfunding.extendDeadline(2); // add 2 days
      var newDeadline = await crowdfunding.deadline();
      expect(newDeadline).to.be.greaterThan(oldDeadline);
    });

    it('should revert extendDeadline if not active', async function() {
      await crowdfunding.togglePause();
      await expect(
        crowdfunding.extendDeadline(2)
      ).to.be.revertedWith('Contract is paused.');
    });
  });
});