import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { assertAction, actions, blankAction } from "../helpers/actionHelpers";

describe("ActionRegistry unit tests", function () {
  async function deployFixture() {
    const [deployer, user] = await ethers.getSigners();

    const ActionRegistry = await ethers.deployContract("ActionRegistry");
    await ActionRegistry.waitForDeployment();

    return { ActionRegistry, deployer, user };
  }
  describe("Deployment", function () {
    it("Should deploy with proper address", async function () {
      const { ActionRegistry } = await loadFixture(deployFixture);

      expect(await ActionRegistry.getAddress()).to.be.properAddress;
    });

    it("Should deploy with proper owner address", async function () {
      const { ActionRegistry, deployer } = await loadFixture(deployFixture);

      expect(await ActionRegistry.owner()).to.equal(deployer.address);
    });

    it("Should deploy with empty actions", async function () {
      const { ActionRegistry } = await loadFixture(deployFixture);

      expect((await ActionRegistry.getActions()).length).to.equal(0);
    });
  });

  describe("Add action", function () {
    it("Should add new action", async function () {
      const { ActionRegistry } = await loadFixture(deployFixture);

      await ActionRegistry.addAction(actions[0]);

      assertAction(await ActionRegistry.getAction(1), actions[0], 1);
    });

    it("Should add new action several times", async function () {
      const { ActionRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < actions.length; i++) {
        await ActionRegistry.addAction(actions[i]);
        assertAction(await ActionRegistry.getAction(i + 1), actions[i], i + 1);
      }
    });

    it("Should revert if caller is not owner", async function () {
      const { ActionRegistry, user } = await loadFixture(deployFixture);

      const tx = ActionRegistry.connect(user).addAction(actions[0]);
      await expect(tx)
        .to.be.revertedWithCustomError(ActionRegistry, "OwnableUnauthorizedAccount")
        .withArgs(user.address);
    });
  });

  describe("Get action", function () {
    it("Should return correct action object", async function () {
      const { ActionRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < actions.length; i++) {
        await ActionRegistry.addAction(actions[i]);
      }

      for (let i = 0; i < actions.length; i++) {
        const action = await ActionRegistry.getAction(i + 1);
        assertAction(action, actions[i], i + 1);
      }
    });

    it("Should return blank action object if ID does not exist", async function () {
      const { ActionRegistry } = await loadFixture(deployFixture);
      const action = await ActionRegistry.getAction(0);

      assertAction(action, blankAction, 0);
    });
  });

  describe("Get all actions", function () {
    it("Should return array with right length", async function () {
      const { ActionRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < actions.length; i++) {
        await ActionRegistry.addAction(actions[i]);
        expect((await ActionRegistry.getActions()).length).to.equal(i + 1);
      }
    });

    it("Should return array with right members", async function () {
      const { ActionRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < actions.length; i++) {
        await ActionRegistry.addAction(actions[i]);
      }

      const retrievedActions = await ActionRegistry.getActions();

      for (let i = 0; i < actions.length; i++) {
        assertAction(retrievedActions[i], actions[i], i + 1);
      }
    });
  });
});
