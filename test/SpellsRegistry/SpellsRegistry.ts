import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { assertSpell } from "../helpers/spellHelpers";
import { blankSpell, spells } from "../helpers/allSpells";
import { SpellsRegistry } from "../../typechain-types";
import { SchoolType } from "../types/types";

describe("SpellsRegistry unit tests", function () {
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

    return { SpellsRegistry, deployer, user };
  }
  describe("Deployment", function () {
    it("Should deploy with proper address", async function () {
      const { SpellsRegistry } = await loadFixture(deployFixture);

      expect(await SpellsRegistry.getAddress()).to.be.properAddress;
    });

    it("Should deploy with proper owner address", async function () {
      const { SpellsRegistry, deployer } = await loadFixture(deployFixture);

      expect(await SpellsRegistry.owner()).to.equal(deployer.address);
    });

    it("Should deploy with empty spells", async function () {
      const { SpellsRegistry } = await loadFixture(deployFixture);

      expect((await SpellsRegistry.getSpells()).length).to.equal(0);
    });
  });

  describe("Add spell", function () {
    it("Should add new spell", async function () {
      const { SpellsRegistry } = await loadFixture(deployFixture);

      await SpellsRegistry.addSpell(spells[0]);

      assertSpell(await SpellsRegistry.getSpell(1), spells[0], 1);
    });

    it("Should add new spell several times", async function () {
      const { SpellsRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < spells.length; i++) {
        await SpellsRegistry.addSpell(spells[i]);
        assertSpell(await SpellsRegistry.getSpell(i + 1), spells[i], i + 1);
      }
    });

    it("Should revert if caller is not owner", async function () {
      const { SpellsRegistry, user } = await loadFixture(deployFixture);

      const tx = SpellsRegistry.connect(user).addSpell(spells[0]);
      await expect(tx)
        .to.be.revertedWithCustomError(SpellsRegistry, "OwnableUnauthorizedAccount")
        .withArgs(user.address);
    });
  });

  describe("Get spell", function () {
    it("Should return correct spell object", async function () {
      const { SpellsRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < spells.length; i++) {
        await SpellsRegistry.addSpell(spells[i]);
      }

      for (let i = 0; i < spells.length; i++) {
        const spell = await SpellsRegistry.getSpell(i + 1);
        assertSpell(spell, spells[i], i + 1);
      }
    });

    it("Should return blank spell object if ID does not exist", async function () {
      const { SpellsRegistry } = await loadFixture(deployFixture);
      const spell = await SpellsRegistry.getSpell(0);

      assertSpell(spell, blankSpell, 0);
    });
  });

  describe("Get all spells", function () {
    it("Should return array with right length", async function () {
      const { SpellsRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < spells.length; i++) {
        await SpellsRegistry.addSpell(spells[i]);
        expect((await SpellsRegistry.getSpells()).length).to.equal(i + 1);
      }
    });

    it("Should return array with right members", async function () {
      const { SpellsRegistry } = await loadFixture(deployFixture);

      for (let i = 0; i < spells.length; i++) {
        await SpellsRegistry.addSpell(spells[i]);
      }

      const retrievedSpells = await SpellsRegistry.getSpells();

      for (let i = 0; i < spells.length; i++) {
        assertSpell(retrievedSpells[i], spells[i], i + 1);
      }
    });
  });

  describe("Get school spells", function () {
    let SpellsRegistry: SpellsRegistry;
    this.beforeAll(async () => {
      SpellsRegistry = (await loadFixture(deployFixture)).SpellsRegistry;

      for (let i = 0; i < spells.length; i++) {
        await SpellsRegistry.addSpell(spells[i]);
      }
    });

    it("Should return only AIR spells", async function () {
      const retrievedSpells = await SpellsRegistry.getSchoolSpells(SchoolType.AIR);

      for (let i = 0; i < retrievedSpells.length; i++) {
        expect(retrievedSpells[i].school).to.equal(SchoolType.AIR);
      }
    });

    it("Should return only ASTRAL_TECHNICS spells", async function () {
      const retrievedSpells = await SpellsRegistry.getSchoolSpells(SchoolType.ASTRAL_TECHNICS);

      for (let i = 0; i < retrievedSpells.length; i++) {
        expect(retrievedSpells[i].school).to.equal(SchoolType.ASTRAL_TECHNICS);
      }
    });

    it("Should return only DARK_STUDIES spells", async function () {
      const retrievedSpells = await SpellsRegistry.getSchoolSpells(SchoolType.DARK_STUDIES);

      for (let i = 0; i < retrievedSpells.length; i++) {
        expect(retrievedSpells[i].school).to.equal(SchoolType.DARK_STUDIES);
      }
    });

    it("Should return only EARTH spells", async function () {
      const retrievedSpells = await SpellsRegistry.getSchoolSpells(SchoolType.EARTH);

      for (let i = 0; i < retrievedSpells.length; i++) {
        expect(retrievedSpells[i].school).to.equal(SchoolType.EARTH);
      }
    });

    it("Should return only FIRE spells", async function () {
      const retrievedSpells = await SpellsRegistry.getSchoolSpells(SchoolType.FIRE);

      for (let i = 0; i < retrievedSpells.length; i++) {
        expect(retrievedSpells[i].school).to.equal(SchoolType.FIRE);
      }
    });

    it("Should return only RECOVERY spells", async function () {
      const retrievedSpells = await SpellsRegistry.getSchoolSpells(SchoolType.RECOVERY);

      for (let i = 0; i < retrievedSpells.length; i++) {
        expect(retrievedSpells[i].school).to.equal(SchoolType.RECOVERY);
      }
    });

    it("Should return only TRANSFORMATION spells", async function () {
      const retrievedSpells = await SpellsRegistry.getSchoolSpells(SchoolType.TRANSFORMATION);

      for (let i = 0; i < retrievedSpells.length; i++) {
        expect(retrievedSpells[i].school).to.equal(SchoolType.TRANSFORMATION);
      }
    });

    it("Should return only WATER spells", async function () {
      const retrievedSpells = await SpellsRegistry.getSchoolSpells(SchoolType.WATER);

      for (let i = 0; i < retrievedSpells.length; i++) {
        expect(retrievedSpells[i].school).to.equal(SchoolType.WATER);
      }
    });
  });
});
