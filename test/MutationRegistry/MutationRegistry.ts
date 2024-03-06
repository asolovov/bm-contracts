import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { assertMutation, mutations, blankMutation } from "../helpers/mutationHelpers";

describe("MutationRegistry unit tests", function () {
  async function deployFixture() {
    const [deployer, user] = await ethers.getSigners();

    const MutationRegistry = await ethers.deployContract("MutationRegistry");
    await MutationRegistry.waitForDeployment();

    return { MutationRegistry, deployer, user };
  }
  describe("Deployment", function () {
    it("Should deploy with proper address", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      expect(await MutationRegistry.getAddress()).to.be.properAddress;
    });

    it("Should deploy with proper owner address", async function () {
      const { MutationRegistry, deployer } = await loadFixture(deployFixture);

      expect(await MutationRegistry.owner()).to.equal(deployer.address);
    });

    it("Should deploy with empty mutations", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      expect((await MutationRegistry.getAllMutations()).length).to.equal(0);
    });
  });

  describe("Add mutation", function () {
    it("Should add new mutation", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      await MutationRegistry.addMutation(mutations[0]);

      assertMutation(await MutationRegistry.getMutation(1), mutations[0], 1);
    });

    it("Should add new mutation several times", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < mutations.length; i++) {
        await MutationRegistry.addMutation(mutations[i]);
        assertMutation(await MutationRegistry.getMutation(i + 1), mutations[i], i + 1);
      }
    });

    it("Should revert if caller is not owner", async function () {
      const { MutationRegistry, user } = await loadFixture(deployFixture);

      const tx = MutationRegistry.connect(user).addMutation(mutations[0]);
      await expect(tx)
        .to.be.revertedWithCustomError(MutationRegistry, "OwnableUnauthorizedAccount")
        .withArgs(user.address);
    });
  });

  describe("Get mutation", function () {
    it("Should return correct mutation object", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < mutations.length; i++) {
        await MutationRegistry.addMutation(mutations[i]);
      }

      for (let i = 0; i < mutations.length; i++) {
        const mutation = await MutationRegistry.getMutation(i + 1);
        assertMutation(mutation, mutations[i], i + 1);
      }
    });

    it("Should return blank mutation object if ID does not exist", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);
      const mutation = await MutationRegistry.getMutation(0);

      assertMutation(mutation, blankMutation, 0);
    });
  });

  describe("Get all mutations", function () {
    it("Should return array with right length", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < mutations.length; i++) {
        await MutationRegistry.addMutation(mutations[i]);
        expect((await MutationRegistry.getAllMutations()).length).to.equal(i + 1);
      }
    });

    it("Should return array with right members", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < mutations.length; i++) {
        await MutationRegistry.addMutation(mutations[i]);
      }

      const retrievedMutations = await MutationRegistry.getAllMutations();

      for (let i = 0; i < mutations.length; i++) {
        assertMutation(retrievedMutations[i], mutations[i], i + 1);
      }
    });
  });
});
