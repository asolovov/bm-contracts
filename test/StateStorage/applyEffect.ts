import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { getEffect } from "../helpers/defaultEffects";
import { DamageType } from "../types/types";
import { getState } from "../helpers/defaultStates";

describe("Apply effect", function () {
  async function deployFixture() {
    const [deployer, user] = await ethers.getSigners();

    const StateStorage = await ethers.deployContract("StateStorage");
    await StateStorage.waitForDeployment();

    return { StateStorage, deployer, user };
  }
  describe("Damage", function () {
    describe("Classic", function () {
      it("Should decrease state shields first", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState({ shields: 10 });
        const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.shields).to.equal(7);
      });

      it("Should decrease state health if shields are less than points", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState({ shields: 1 });
        const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.health).to.equal(8);
        expect(result.shields).to.equal(0);
      });

      it("Should decrease state health if no shields", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState();
        const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.health).to.equal(7);
      });

      it("Should decrease state health to zero if points are more than health", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState({ health: 2 });
        const effect = getEffect({ points: 3, damageType: DamageType.CLASSIC });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.health).to.equal(0);
      });
    });

    describe("Piercing", function () {
      it("Should decrease state health", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState();
        const effect = getEffect({ points: 3, damageType: DamageType.PIERCING });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.health).to.equal(7);
      });

      it("Should decrease state health if shields are more than zero", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState({ shields: 10 });
        const effect = getEffect({ points: 3, damageType: DamageType.PIERCING });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.health).to.equal(7);
      });

      it("Should decrease state health to zero if points are more than health", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState({ health: 2 });
        const effect = getEffect({ points: 3, damageType: DamageType.PIERCING });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.health).to.equal(0);
      });
    });

    describe("Shield breaking", function () {
      it("Should decrease state shields", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState({ shields: 10 });
        const effect = getEffect({ points: 3, damageType: DamageType.SHIELD_BREAKING });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.shields).to.equal(7);
      });

      it("Should not decrease state health if points are more than shields", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState({ shields: 1 });
        const effect = getEffect({ points: 3, damageType: DamageType.SHIELD_BREAKING });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.shields).to.equal(0);
        expect(result.health).to.equal(10);
      });

      it("Should decrease state shields to zero if points are more than shields", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState({ shields: 2 });
        const effect = getEffect({ points: 3, damageType: DamageType.SHIELD_BREAKING });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.shields).to.equal(0);
      });
    });

    describe("Healing", function () {
      it("Should increase state health", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState({ health: 7 });
        const effect = getEffect({ points: 3, damageType: DamageType.HEALING });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.health).to.equal(10);
      });

      it("Should not increase state health more than MaxHealth", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState();
        const effect = getEffect({ points: 3, damageType: DamageType.HEALING });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.health).to.equal(12);
      });
    });

    describe("Increase shields", function () {
      it("Should increase state shields", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState();
        const effect = getEffect({ points: 3, damageType: DamageType.INCREASE_SHIELDS });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.shields).to.equal(3);
      });

      it("Should not increase state shields more than MaxShields", async function () {
        const { StateStorage } = await loadFixture(deployFixture);

        const state = getState({ shields: 19 });
        const effect = getEffect({ points: 3, damageType: DamageType.INCREASE_SHIELDS });

        const result = await StateStorage.applyActionEffects(effect, state, 1);

        expect(result.shields).to.equal(20);
      });
    });
  });

  describe("Set shields", function () {
    it("Should set state shields", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState();
      const effect = getEffect({ points: 3, setShields: true });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.shields).to.equal(3);
    });

    it("Should set state shields to number even if it is less than previous", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ shields: 5 });
      const effect = getEffect({ points: 3, setShields: true });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.shields).to.equal(3);
    });

    it("Should set state shields to number even if it is more than MaxShields", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ shields: 5 });
      const effect = getEffect({ points: 22, setShields: true });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.shields).to.equal(22);
    });
  });

  describe("Skip", function () {
    it("Should set state.isPass field to true", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState();
      const effect = getEffect({ skip: true });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.isPass).to.true;
    });
  });

  describe("Add status", function () {
    it("Should add new status ID to state.statuses", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState();
      const effect = getEffect({ addStatus: 1 });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.statuses[0]).to.equal(1);
    });

    it("Should add new status ID to the end of state.statuses array", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2], turns: [1, 1] });
      const effect = getEffect({ addStatus: 3 });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.statuses[result.statuses.length - 1]).to.equal(3);
    });

    it("Should increase state.statuses length", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2], turns: [1, 1] });
      const effect = getEffect({ addStatus: 3 });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.statuses.length).to.equal(state.statuses.length + 1);
    });

    it("Should add current turn to the end of state.turns array", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2], turns: [1, 1] });
      const effect = getEffect({ addStatus: 3 });

      const result = await StateStorage.applyActionEffects(effect, state, 2);

      expect(result.turns[result.turns.length - 1]).to.equal(2);
    });

    it("Should increase state.turns length", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2], turns: [1, 1] });
      const effect = getEffect({ addStatus: 3 });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.turns.length).to.equal(state.turns.length + 1);
    });
  });

  describe("Burn status", function () {
    it("Should remove status ID from state.statuses", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2], turns: [1, 2] });
      const effect = getEffect({ burnStatus: 1 });

      const result = await StateStorage.applyActionEffects(effect, state, 2);

      expect(result.statuses[0]).to.equal(2);
    });

    it("Should decrease state.statuses length", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2], turns: [1, 2] });
      const effect = getEffect({ burnStatus: 1 });

      const result = await StateStorage.applyActionEffects(effect, state, 2);

      expect(result.statuses.length).to.equal(state.statuses.length - 1);
    });

    it("Should remove turn from state.turns array respectively", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2], turns: [1, 2] });
      const effect = getEffect({ burnStatus: 1 });

      const result = await StateStorage.applyActionEffects(effect, state, 2);

      expect(result.turns[0]).to.equal(2);
    });

    it("Should decrease state.turns length", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2], turns: [1, 2] });
      const effect = getEffect({ burnStatus: 1 });

      const result = await StateStorage.applyActionEffects(effect, state, 2);

      expect(result.turns.length).to.equal(state.turns.length - 1);
    });

    it("Should not change state.turns order", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2, 3, 4, 5], turns: [1, 2, 3, 4, 5] });
      const effect = getEffect({ burnStatus: 3 });

      const result = await StateStorage.applyActionEffects(effect, state, 5);

      expect(result.turns).to.deep.equal([1, 2, 4, 5]);
    });
  });

  describe("Burn all statuses", function () {
    it("Should remove all given statuses from state", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2, 3], turns: [1, 2, 3] });
      const effect = getEffect({ burnAllStatuses: [1, 2, 3] });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.statuses.length).to.equal(0);
    });

    it("Should remove only given statuses from state", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2, 3, 4, 5], turns: [1, 2, 3, 4, 5] });
      const effect = getEffect({ burnAllStatuses: [1, 3, 5] });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.statuses.length).to.equal(2);
    });

    it("Should not change statuses order", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2, 3, 4, 5], turns: [1, 2, 3, 4, 5] });
      const effect = getEffect({ burnAllStatuses: [1, 3, 5] });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.statuses).to.deep.equal([2, 4]);
    });

    it("Should remove statuses` turns", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2, 3], turns: [1, 2, 3] });
      const effect = getEffect({ burnAllStatuses: [1, 2, 3] });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.turns.length).to.equal(0);
    });

    it("Should remove statuses` turns respectively", async function () {
      const { StateStorage } = await loadFixture(deployFixture);

      const state = getState({ statuses: [1, 2, 3, 4, 5], turns: [1, 2, 3, 4, 5] });
      const effect = getEffect({ burnAllStatuses: [1, 3, 5] });

      const result = await StateStorage.applyActionEffects(effect, state, 1);

      expect(result.turns).to.deep.equal([2, 4]);
    });
  });
});
