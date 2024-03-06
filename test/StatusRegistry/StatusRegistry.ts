import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { assertStatus } from "../helpers/statusHelpers";
import { blankStatus, statuses } from "../helpers/allStatuses";

describe("StatusRegistry unit tests", function () {
  async function deployFixture() {
    const [deployer, user] = await ethers.getSigners();

    const ActionRegistry = await ethers.deployContract("ActionRegistry");
    await ActionRegistry.waitForDeployment();

    const MutationRegistry = await ethers.deployContract("MutationRegistry");
    await MutationRegistry.waitForDeployment();

    const StateStorage = await ethers.deployContract("StateStorage");
    await StateStorage.waitForDeployment();

    const StatusRegistry = await ethers.deployContract("StatusRegistry", [
      ActionRegistry.target,
      MutationRegistry.target,
      StateStorage.target,
    ]);
    await StatusRegistry.waitForDeployment();

    const SpellsRegistry = await ethers.deployContract("SpellsRegistry", [
      ActionRegistry.target,
      StatusRegistry.target,
      StateStorage.target,
    ]);
    await SpellsRegistry.waitForDeployment();

    return { StatusRegistry, deployer, user };
  }
  describe("Deployment", function () {
    it("Should deploy with proper address", async function () {
      const { StatusRegistry } = await loadFixture(deployFixture);

      expect(await StatusRegistry.getAddress()).to.be.properAddress;
    });

    it("Should deploy with proper owner address", async function () {
      const { StatusRegistry, deployer } = await loadFixture(deployFixture);

      expect(await StatusRegistry.owner()).to.equal(deployer.address);
    });

    it("Should deploy with empty statuses", async function () {
      const { StatusRegistry } = await loadFixture(deployFixture);

      expect((await StatusRegistry.getStatuses()).length).to.equal(0);
    });
  });

  describe("Add status", function () {
    it("Should add new status", async function () {
      const { StatusRegistry } = await loadFixture(deployFixture);

      await StatusRegistry.addStatus(statuses[0]);

      assertStatus(await StatusRegistry.getStatus(1), statuses[0], 1);
    });

    it("Should add new status several times", async function () {
      const { StatusRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < statuses.length; i++) {
        await StatusRegistry.addStatus(statuses[i]);
        assertStatus(await StatusRegistry.getStatus(i + 1), statuses[i], i + 1);
      }
    });

    it("Should revert if caller is not owner", async function () {
      const { StatusRegistry, user } = await loadFixture(deployFixture);

      const tx = StatusRegistry.connect(user).addStatus(statuses[0]);
      await expect(tx)
        .to.be.revertedWithCustomError(StatusRegistry, "OwnableUnauthorizedAccount")
        .withArgs(user.address);
    });
  });

  describe("Get spell", function () {
    it("Should return correct status object", async function () {
      const { StatusRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < statuses.length; i++) {
        await StatusRegistry.addStatus(statuses[i]);
      }

      for (let i = 0; i < statuses.length; i++) {
        const status = await StatusRegistry.getStatus(i + 1);
        assertStatus(status, statuses[i], i + 1);
      }
    });

    it("Should return blank status object if ID does not exist", async function () {
      const { StatusRegistry } = await loadFixture(deployFixture);
      const status = await StatusRegistry.getStatus(0);

      assertStatus(status, blankStatus, 0);
    });
  });

  describe("Get all statuses", function () {
    it("Should return array with right length", async function () {
      const { StatusRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < statuses.length; i++) {
        await StatusRegistry.addStatus(statuses[i]);
        expect((await StatusRegistry.getStatuses()).length).to.equal(i + 1);
      }
    });

    it("Should return array with right members", async function () {
      const { StatusRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < statuses.length; i++) {
        await StatusRegistry.addStatus(statuses[i]);
      }

      const retrievedStatuses = await StatusRegistry.getStatuses();

      for (let i = 0; i < statuses.length; i++) {
        assertStatus(retrievedStatuses[i], statuses[i], i + 1);
      }
    });
  });
});
