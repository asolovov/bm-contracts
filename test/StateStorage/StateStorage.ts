import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("StateStorage unit tests", function () {
  async function deployFixture() {
    const [deployer, user] = await ethers.getSigners();

    const StateStorage = await ethers.deployContract("StateStorage");
    await StateStorage.waitForDeployment();

    return { StateStorage, deployer, user };
  }

  describe("Deployment", function () {
    it("Should deploy with proper address", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      expect(await StateStorage.getAddress()).to.be.properAddress;
    });

    it("Should deploy with proper initial values", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      expect(await StateStorage.initialHealth()).to.equal(12);
      expect(await StateStorage.initialShields()).to.equal(0);
      expect(await StateStorage.maxShields()).to.equal(20);
      expect(await StateStorage.initialSpells()).to.equal(10);
    });
  });

  describe("Set initial values", function () {
    it("Should set init health", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      await StateStorage.setInitialHealth(20);

      expect(await StateStorage.initialHealth()).to.equal(20);
    });

    it("Should set init shields", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      await StateStorage.setInitialShields(20);

      expect(await StateStorage.initialShields()).to.equal(20);
    });

    it("Should set max shields", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      await StateStorage.setMaxShields(30);

      expect(await StateStorage.maxShields()).to.equal(30);
    });

    it("Should set init spells", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      await StateStorage.setInitialSpells(20);

      expect(await StateStorage.initialSpells()).to.equal(20);
    });
  });
});
