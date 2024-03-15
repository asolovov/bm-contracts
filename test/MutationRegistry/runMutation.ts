import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { getEffect } from "../helpers/defaultEffects";
import { DamageType, SchoolType } from "../types/types";
import { getState } from "../helpers/defaultStates";
import { mutations } from "../helpers/mutationHelpers";
import { MutationID, StatusID } from "../helpers/IDs";

describe("Run mutation", function () {
  async function deployFixture() {
    const [deployer, user] = await ethers.getSigners();

    const MutationRegistry = await ethers.deployContract("MutationRegistry");
    await MutationRegistry.waitForDeployment();

    for (const mutation of mutations) {
      await MutationRegistry.addMutation(mutation);
    }

    return { MutationRegistry, deployer, user };
  }

  describe("Block statuses", function () {
    it("Should block addStatus effect", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ addStatus: 1 });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.blockStatuses, effect, state);

      expect(result.addStatus).to.equal(0);
    });

    it("Should block changeStatus effect", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ addStatus: 1, burnStatus: 2, changeStatus: true });
      const state = getState({ statuses: [2] });

      const result = await MutationRegistry.runMutation(MutationID.blockStatuses, effect, state);

      expect(result.addStatus).to.equal(0);
      expect(result.burnStatus).to.equal(0);
      expect(result.changeStatus).to.false;
    });

    it("Should block addStatus for any StatusID", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i < 10; i++) {
        const effect = getEffect({ addStatus: i });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.blockStatuses, effect, state);

        expect(result.addStatus).to.equal(0);
      }
    });
  });

  describe("Decrease damage by 1 if damage more than 1", function () {
    it("Should decrease effect points by 1", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.PIERCING });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.decreaseDamage1IfDamageMoreThan1, effect, state);

      expect(result.points).to.equal(2);
    });

    it("Should not decrease effect points if points less than or equal 1", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 1, damageType: DamageType.PIERCING });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.decreaseDamage1IfDamageMoreThan1, effect, state);

      expect(result.points).to.equal(1);
    });

    it("Should work for each damage type", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i <= 5; i++) {
        const effect = getEffect({ points: 3, damageType: i });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.decreaseDamage1IfDamageMoreThan1, effect, state);

        expect(result.points).to.equal(2);
      }
    });
  });

  describe("Change Healing damage to Classic", function () {
    it("Should change damage type to Classic", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.HEALING });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.healingToClassic, effect, state);

      expect(result.damageType).to.equal(DamageType.CLASSIC);
    });

    it("Should not change damage type if effect damage type is not Healing", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i <= 5; i++) {
        if (i == DamageType.HEALING) {
          continue;
        }
        const effect = getEffect({ points: 3, damageType: i });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.healingToClassic, effect, state);

        expect(result.damageType).to.equal(i);
      }
    });
  });

  describe("Set health damage to one HP", function () {
    it("Should set effect points to 1 if damage type is Piercing", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.PIERCING });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.setDamageToHP, effect, state);

      expect(result.points).to.equal(1);
    });

    it("Should set effect points to 1 if damage type is Classic and state.shields == 0", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.setDamageToHP, effect, state);

      expect(result.points).to.equal(1);
    });

    it("Should set effect points to state.shields + 1 if damage type is Classic and more points than shields", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC });
      const state = getState({ shields: 1 });

      const result = await MutationRegistry.runMutation(MutationID.setDamageToHP, effect, state);

      expect(result.points).to.equal(2);
    });

    it("Should not change effect points if damage type is Classic and points less than shields", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC });
      const state = getState({ shields: 5 });

      const result = await MutationRegistry.runMutation(MutationID.setDamageToHP, effect, state);

      expect(result.points).to.equal(3);
    });

    it("Should not change effect points if damage type is not Classic or Piercing", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i <= 5; i++) {
        if (i == DamageType.CLASSIC || i == DamageType.PIERCING) {
          continue;
        }
        const effect = getEffect({ points: 3, damageType: i });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.setDamageToHP, effect, state);

        expect(result.points).to.equal(3);
      }
    });
  });

  describe("Increase Piercing damage", function () {
    it("Should increase effect points", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.PIERCING });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.increasePiercing, effect, state);

      expect(result.points).to.equal(4);
    });

    it("Should not increase effect points if DamageType is not Piercing", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i <= 5; i++) {
        if (i == DamageType.PIERCING) {
          continue;
        }
        const effect = getEffect({ points: 3, damageType: i });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.healingToClassic, effect, state);

        expect(result.points).to.equal(3);
      }
    });
  });

  describe("Block Piercing damage", function () {
    it("Should set effect points to zero", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.PIERCING });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.blockPiercing, effect, state);

      expect(result.points).to.equal(0);
    });

    it("Should not change effect points if DamageType is not piercing", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i <= 5; i++) {
        if (i == DamageType.PIERCING) {
          continue;
        }
        const effect = getEffect({ points: 3, damageType: i });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.healingToClassic, effect, state);

        expect(result.points).to.equal(3);
      }
    });
  });

  describe("Change Classic damage to Piercing", function () {
    it("Should change damage type to Piercing", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.classicToPiercing, effect, state);

      expect(result.damageType).to.equal(DamageType.PIERCING);
    });

    it("Should not change damage type if effect DamageType is not Classic", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i <= 5; i++) {
        if (i == DamageType.CLASSIC) {
          continue;
        }
        const effect = getEffect({ points: 3, damageType: i });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.classicToPiercing, effect, state);

        expect(result.damageType).to.equal(i);
      }
    });
  });

  describe("Block Burns mutation", function () {
    it("Should block Burns status", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ addStatus: StatusID.burns });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.blockBurnsMutation, effect, state);

      expect(result.addStatus).to.equal(0);
    });

    it("Should not block any other statuses", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i <= 10; i++) {
        if (i == StatusID.burns) {
          continue;
        }
        const effect = getEffect({ addStatus: i });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.blockBurnsMutation, effect, state);

        expect(result.addStatus).to.equal(i);
      }
    });
  });

  describe("Block Ignition mutation", function () {
    it("Should block Ignition status", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ addStatus: StatusID.ignition });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.blockIgnitionMutation, effect, state);

      expect(result.addStatus).to.equal(0);
    });

    it("Should not block any other statuses", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i <= 10; i++) {
        if (i == StatusID.ignition) {
          continue;
        }
        const effect = getEffect({ addStatus: i });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.blockIgnitionMutation, effect, state);

        expect(result.addStatus).to.equal(i);
      }
    });
  });

  describe("Change Classic damage to Healing if school is Fire", function () {
    it("Should change damage type", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC, damageSchool: SchoolType.FIRE });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.classicToHealingFire, effect, state);

      expect(result.damageType).to.equal(DamageType.HEALING);
    });

    it("Should change damage type if effect DamageType is not Classic", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i <= 5; i++) {
        if (i == DamageType.CLASSIC) {
          continue;
        }
        const effect = getEffect({ points: 3, damageType: i, damageSchool: SchoolType.FIRE });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.classicToHealingFire, effect, state);

        expect(result.damageType).to.equal(i);
      }
    });

    it("Should change damage type if effect DamageSchool is not Fire", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i <= 8; i++) {
        if (i == SchoolType.FIRE) {
          continue;
        }
        const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC, damageSchool: i });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.classicToHealingFire, effect, state);

        expect(result.damageType).to.equal(DamageType.CLASSIC);
      }
    });
  });

  describe("Block Shield damage", function () {
    it("Should set effect points to zero if state.shields more than zero and damage type is Shield breaking", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.SHIELD_BREAKING });
      const state = getState({ shields: 5 });

      const result = await MutationRegistry.runMutation(MutationID.blockShieldDamage, effect, state);

      expect(result.points).to.equal(0);
    });

    it("Should set effect points to zero if state.shields more than zero and damage type is Classic", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC });
      const state = getState({ shields: 5 });

      const result = await MutationRegistry.runMutation(MutationID.blockShieldDamage, effect, state);

      expect(result.points).to.equal(0);
    });

    it("Should not change effect points if state.shields is zero and damage type is Shield breaking", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.SHIELD_BREAKING });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.blockShieldDamage, effect, state);

      expect(result.points).to.equal(3);
    });

    it("Should not change effect points if state.shields is zero and damage type is Classic", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC });
      const state = getState();

      const result = await MutationRegistry.runMutation(MutationID.blockShieldDamage, effect, state);

      expect(result.points).to.equal(3);
    });

    it("Should not change effect points if DamageType is not Classic or Shield breaking", async function () {
      const { MutationRegistry } = await loadFixture(deployFixture);

      for (let i = 1; i <= 5; i++) {
        if (i == DamageType.CLASSIC || i == DamageType.SHIELD_BREAKING) {
          continue;
        }
        const effect = getEffect({ points: 3, damageType: i });
        const state = getState();

        const result = await MutationRegistry.runMutation(MutationID.blockShieldDamage, effect, state);

        expect(result.points).to.equal(3);
      }
    });
  });
});
