import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { assertAction, actions, blankAction } from "../helpers/actionHelpers";

describe("ActionRegistry unit tests", function () {
  async function deployFixture() {
    const [deployer, user] = await ethers.getSigners();

    const ActionRegistry = await ethers.deployContract("ActionRegistry");
    await ActionRegistry.waitForDeployment();

    for (const action of actions) {
      ActionRegistry.addAction(action);
    }

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
});
