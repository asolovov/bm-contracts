import { ethers } from "hardhat";
import { assertMutation, classicToPiercing, increasePiercing } from "../helpers/mutationHelpers";
import { assertStatus, getDepletedAir, getStaticElectricity } from "../helpers/statusHelpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  addAirShield,
  addDepletedAir,
  addStaticElectricity,
  breakShieldsAllAir,
  classic1AirIfNoStaticElStatus,
  classic3AirIfStaticElStatus,
  classicDamage0Air,
  classicDamage1_2Air,
  classicDamage1Air,
  classicDamage2_3Air,
  classicDamage2Air,
  heal0_2Air,
  piercing2Air,
  shields0_2Air,
  shields0Air,
  shields5Air,
} from "../helpers/actionHelpers";
import {
  aeroAssault,
  assertSpell,
  blitzkriegByte,
  doubleTroubleThunder,
  lightningClassic,
  megaVoltWunderwaffle,
  powerSurge,
  teslasTrick,
  thunderstruckTwirl,
  zeldasZigzag,
  zephyrZipline,
} from "../helpers/spellHelpers";
import { States } from "../../typechain-types/contracts/interfaces/IState";
import { SchoolType } from "../types/types";
import { assertMageStatus, assertMageStatusApr, mapMageState } from "../helpers/mageStatusHelpers";

describe("Spells tests", function () {
  async function deployFixture() {
    const [deployer] = await ethers.getSigners();

    const Actions = await ethers.deployContract("ActionRegistry");
    const actions = await Actions.waitForDeployment();

    const Mutations = await ethers.deployContract("MutationRegistry");
    const mutations = await Mutations.waitForDeployment();

    const State = await ethers.deployContract("StateStorage");
    const state = await State.waitForDeployment();

    const Statuses = await ethers.deployContract("StatusRegistry", [actions.target, mutations.target, state.target]);
    const statuses = await Statuses.waitForDeployment();

    const Spells = await ethers.deployContract("SpellsRegistry", [actions.target, statuses.target, state.target]);
    const spells = await Spells.waitForDeployment();

    return {
      deployer,
      mutations,
      actions,
      statuses,
      spells,
    };
  }

  describe.only("Add and run spells", function () {
    describe("Air spells", function () {
      it("Mega Volt Wunderwaffle", async function () {
        const { mutations, actions, statuses, spells } = await loadFixture(deployFixture);

        const selfState: States.FullStateStruct = {
          id: 1,
          name: "test1",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentState: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 7,
          spells: [],
          statuses: [1],
          turns: [3],
          isPass: false,
        };

        const selfStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        await mutations.addMutation(classicToPiercing);
        await statuses.addStatus(getStaticElectricity([1]));

        await actions.addAction(classicDamage2Air);
        await actions.addAction(addStaticElectricity(1));

        await spells.addSpell(megaVoltWunderwaffle([1, 2]));
        const spell = await spells.getSpell(1);
        assertSpell(spell, megaVoltWunderwaffle([1, 2]));

        const resSelf = await spells.runNextSpellSelf(selfState, opponentState, 3);
        assertMageStatus(resSelf, selfState);

        const [resOpponent, resSelf2] = await spells.runNextSpellOpponent(mapMageState(resSelf), opponentState, 3);
        assertMageStatus(resOpponent, opponentStateExpect);
        assertMageStatus(resSelf2, selfStateExpect);
      });

      it("Power Surge", async function () {
        const { mutations, actions, statuses, spells } = await loadFixture(deployFixture);

        const selfState: States.FullStateStruct = {
          id: 1,
          name: "test1",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentState: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 8,
          spells: [],
          statuses: [1],
          turns: [3],
          isPass: false,
        };

        const selfStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        await mutations.addMutation(increasePiercing);
        await statuses.addStatus(getDepletedAir([1]));

        await actions.addAction(classicDamage1_2Air);
        await actions.addAction(addDepletedAir(1));

        await spells.addSpell(powerSurge([1, 2]));
        const spell = await spells.getSpell(1);
        assertSpell(spell, powerSurge([1, 2]));

        const resSelf = await spells.runNextSpellSelf(selfState, opponentState, 3);
        assertMageStatus(resSelf, selfState);

        const [resOpponent, resSelf2] = await spells.runNextSpellOpponent(mapMageState(resSelf), opponentState, 3);
        assertMageStatusApr(resOpponent, opponentStateExpect, 12, 1);
        assertMageStatus(resSelf2, selfStateExpect);
      });

      it("Blitzkrieg Byte", async function () {
        const { mutations, actions, statuses, spells } = await loadFixture(deployFixture);

        const selfState: States.FullStateStruct = {
          id: 1,
          name: "test1",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentState: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 8,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const selfStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        await actions.addAction(classic3AirIfStaticElStatus(1));
        await actions.addAction(classic1AirIfNoStaticElStatus(1));

        await spells.addSpell(blitzkriegByte([1, 2]));
        const spell = await spells.getSpell(1);
        assertSpell(spell, blitzkriegByte([1, 2]));

        const resSelf = await spells.runNextSpellSelf(selfState, opponentState, 3);
        assertMageStatus(resSelf, selfState);

        const [resOpponent, resSelf2] = await spells.runNextSpellOpponent(mapMageState(resSelf), opponentState, 3);
        assertMageStatus(resOpponent, opponentStateExpect);
        assertMageStatus(resSelf2, selfStateExpect);
      });

      it("Tesla's Trick", async function () {
        const { mutations, actions, statuses, spells } = await loadFixture(deployFixture);

        const selfState: States.FullStateStruct = {
          id: 1,
          name: "test1",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentState: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const selfStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 11,
          shields: 11,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const selfStateExpect2: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 11,
          shields: 11,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        await actions.addAction(shields0_2Air);
        await actions.addAction(heal0_2Air);

        await spells.addSpell(teslasTrick([1, 2]));
        const spell = await spells.getSpell(1);
        assertSpell(spell, teslasTrick([1, 2]));

        const resSelf = await spells.runNextSpellSelf(selfState, opponentState, 3);
        assertMageStatusApr(resSelf, selfStateExpect, 2, 2);

        const [resOpponent, resSelf2] = await spells.runNextSpellOpponent(mapMageState(resSelf), opponentState, 3);
        assertMageStatus(resOpponent, opponentState);
        assertMageStatusApr(resSelf2, selfStateExpect2, 2, 2);
      });

      it("Double Trouble Thunder", async function () {
        const { mutations, actions, statuses, spells } = await loadFixture(deployFixture);

        const selfState: States.FullStateStruct = {
          id: 1,
          name: "test1",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentState: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 7,
          spells: [],
          statuses: [1],
          turns: [3],
          isPass: false,
        };

        const selfStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [1],
          turns: [3],
          isPass: false,
        };

        const selfStateExpect2: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [1],
          turns: [3],
          isPass: false,
        };

        await actions.addAction(classicDamage2_3Air);
        await actions.addAction(addStaticElectricity(1));

        await spells.addSpell(doubleTroubleThunder([2], [1, 2]));
        const spell = await spells.getSpell(1);
        assertSpell(spell, doubleTroubleThunder([2], [1, 2]));

        const resSelf = await spells.runNextSpellSelf(selfState, opponentState, 3);
        assertMageStatusApr(resSelf, selfStateExpect, 2, 2);

        const [resOpponent, resSelf2] = await spells.runNextSpellOpponent(mapMageState(resSelf), opponentState, 3);
        assertMageStatusApr(resOpponent, opponentStateExpect, 1, 1);
        assertMageStatus(resSelf2, selfStateExpect2);
      });

      it("Zephyr Zipline", async function () {
        const { mutations, actions, statuses, spells } = await loadFixture(deployFixture);

        const selfState: States.FullStateStruct = {
          id: 1,
          name: "test1",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const selfStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const selfStateExpect2: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentState: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 9,
          spells: [],
          statuses: [1, 2],
          turns: [3, 3],
          isPass: false,
        };

        await actions.addAction(classicDamage0Air);
        await actions.addAction(addStaticElectricity(1));
        await actions.addAction(addDepletedAir(2));

        await spells.addSpell(zephyrZipline([1, 2, 3]));
        const spell = await spells.getSpell(1);
        assertSpell(spell, zephyrZipline([1, 2, 3]));

        const resSelf = await spells.runNextSpellSelf(selfState, opponentState, 3);
        assertMageStatus(resSelf, selfStateExpect);

        const [resOpponent, resSelf2] = await spells.runNextSpellOpponent(mapMageState(resSelf), opponentState, 3);
        assertMageStatus(resOpponent, opponentStateExpect);
        assertMageStatus(resSelf2, selfStateExpect2);
      });

      it("Aero Assault", async function () {
        const { mutations, actions, statuses, spells } = await loadFixture(deployFixture);

        const selfState: States.FullStateStruct = {
          id: 1,
          name: "test1",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const selfStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 11,
          spells: [1],
          statuses: [1],
          turns: [3],
          isPass: false,
        };

        const selfStateExpect2: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 11,
          spells: [],
          statuses: [1],
          turns: [3],
          isPass: false,
        };

        const opponentState: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        await actions.addAction(shields0Air);
        await actions.addAction(addAirShield(1));

        await spells.addSpell(aeroAssault([1, 2]));
        const spell = await spells.getSpell(1);
        assertSpell(spell, aeroAssault([1, 2]));

        const resSelf = await spells.runNextSpellSelf(selfState, opponentState, 3);
        assertMageStatus(resSelf, selfStateExpect);

        const [resOpponent, resSelf2] = await spells.runNextSpellOpponent(mapMageState(resSelf), opponentState, 3);
        assertMageStatus(resOpponent, opponentStateExpect);
        assertMageStatus(resSelf2, selfStateExpect2);
      });

      it("Lightning Classic", async function () {
        const { mutations, actions, statuses, spells } = await loadFixture(deployFixture);

        const selfState: States.FullStateStruct = {
          id: 1,
          name: "test1",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const selfStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const selfStateExpect2: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentState: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 7,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        await actions.addAction(piercing2Air);

        await spells.addSpell(lightningClassic([1]));
        const spell = await spells.getSpell(1);
        assertSpell(spell, lightningClassic([1]));

        const resSelf = await spells.runNextSpellSelf(selfState, opponentState, 3);
        assertMageStatus(resSelf, selfStateExpect);

        const [resOpponent, resSelf2] = await spells.runNextSpellOpponent(mapMageState(resSelf), opponentState, 3);
        assertMageStatus(resOpponent, opponentStateExpect);
        assertMageStatus(resSelf2, selfStateExpect2);
      });

      it("Thunderstruck Twirl", async function () {
        const { mutations, actions, statuses, spells } = await loadFixture(deployFixture);

        const selfState: States.FullStateStruct = {
          id: 1,
          name: "test1",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const selfStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const selfStateExpect2: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentState: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 8,
          shields: 0,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        await actions.addAction(breakShieldsAllAir);
        await actions.addAction(classicDamage1Air);

        await spells.addSpell(thunderstruckTwirl([1, 2]));
        const spell = await spells.getSpell(1);
        assertSpell(spell, thunderstruckTwirl([1, 2]));

        const resSelf = await spells.runNextSpellSelf(selfState, opponentState, 3);
        assertMageStatus(resSelf, selfStateExpect);

        const [resOpponent, resSelf2] = await spells.runNextSpellOpponent(mapMageState(resSelf), opponentState, 3);
        assertMageStatus(resOpponent, opponentStateExpect);
        assertMageStatus(resSelf2, selfStateExpect2);
      });

      it("Zelda's Zigzag", async function () {
        const { mutations, actions, statuses, spells } = await loadFixture(deployFixture);

        const selfState: States.FullStateStruct = {
          id: 1,
          name: "test1",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 10,
          spells: [1],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const selfStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 16,
          spells: [1],
          statuses: [1],
          turns: [3],
          isPass: false,
        };

        const selfStateExpect2: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.AIR,
          health: 10,
          shields: 16,
          spells: [],
          statuses: [1],
          turns: [3],
          isPass: false,
        };

        const opponentState: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        const opponentStateExpect: States.FullStateStruct = {
          id: 1,
          name: "test2",
          race: 1,
          school: SchoolType.FIRE,
          health: 10,
          shields: 10,
          spells: [],
          statuses: [],
          turns: [],
          isPass: false,
        };

        await actions.addAction(shields5Air);
        await actions.addAction(addDepletedAir(1));

        await spells.addSpell(zeldasZigzag([1, 2]));
        const spell = await spells.getSpell(1);
        assertSpell(spell, zeldasZigzag([1, 2]));

        const resSelf = await spells.runNextSpellSelf(selfState, opponentState, 3);
        assertMageStatus(resSelf, selfStateExpect);

        const [resOpponent, resSelf2] = await spells.runNextSpellOpponent(mapMageState(resSelf), opponentState, 3);
        assertMageStatus(resOpponent, opponentStateExpect);
        assertMageStatus(resSelf2, selfStateExpect2);
      });
    });
  });
});
