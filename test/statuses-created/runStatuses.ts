import {expect} from "chai";
import {loadFixture, mine} from "@nomicfoundation/hardhat-network-helpers";
import {ethers,} from "hardhat";
import {
    assertMutation,
    blockPiercing, blockShieldDamage, blockStatuses, classicToHealingFire,
    classicToPiercing, decreaseDamage1IfDamageMoreThan1,
    getBlockBurnsMutation, getBlockIgnitionMutation, healingToClassic,
    increasePiercing, setDamageToHP,
} from "../helpers/mutationHelpers";
import {
    abundantGrowth,
    assertStatus, callOfCthulhu, coolAid, darkMatter, decayAndRot,
    deepFreeze, deepSeatedFears,
    everythingPoison, fearFeaster,
    fromGenerosity,
    getAirShield,
    getAshenShield,
    getBurns,
    getDepletedAir,
    getFireAcolyte,
    getGrounding,
    getIAmFire,
    getIgnition,
    getShrapnel,
    getStaticElectricity,
    getWallOfFire, gravemine,
    humility,
    poison,
    purity, reflection,
    regeneration,
    retribution,
    stunning,
    toxicShock,
    waterShield, whaIsDeadMayNeverDie
} from "../helpers/statusHelpers";
import {MageState, SpellState} from "../../typechain-types/contracts/implementation/status/StatusRegistry";
import {assertSpellState} from "../helpers/spellHelpers";
import {assertMageStatus} from "../helpers/mageStatusHelpers";
import {DamageType, SchoolType} from "../types/types";
import {
    addDeepSeatedFears,
    assertAction,
    burnAllStatuses,
    burnSpellIfMaxHP,
    burnSpellIfSkip,
    deal1ClassicIfShields0,
    deal1Healing, deal1HealingIfDead,
    deal1IncreaseShields,
    deal1Piercing, deal1PiercingIfHealthMoreThan6,
    deal1PiercingIfSkip,
    deal2Piercing, deal2ShieldsIfHealthLessThan6,
    deal9Classic,
    decreaseShields1IfShieldsMore0,
    getAddBurnsAction,
    getChangeStatusToIgnitionAction,
    ifMaxHPAddLightningClassicSpell,
    skip30Chance, skip50Chance,
    skipTurn
} from "../helpers/actionHelpers";
import {Effects, States} from "../../typechain-types/contracts/interfaces/IState";

describe("Actions unit tests", function () {
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

        return {
            deployer,
            mutations,
            actions,
            statuses
        };
    }

    describe("Quick tests", function () {
        it("Static Electricity", async function () {
            const {mutations, actions, statuses} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

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
                isPass: false
            }

            const spellState:  Effects.ActionEffectStruct = {
                points: 3,
                damageType: DamageType.CLASSIC,
                damageSchool: SchoolType.UNKNOWN,
                setShields: false,
                addStatus: 0,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }

            const expectedSpell: Effects.ActionEffectStruct = {
                points: 3,
                damageType: DamageType.PIERCING,
                damageSchool: SchoolType.UNKNOWN,
                setShields: false,
                addStatus: 0,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }

            await mutations.addMutation(classicToPiercing);
            const mut1 = await mutations.getMutation(1);
            assertMutation(mut1, classicToPiercing, 1);

            await statuses.addStatus(getStaticElectricity([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, getStaticElectricity([1]), 1);

            const spellStateRes =
                await statuses.runPassiveStatuses(selfState, spellState);

            assertSpellState(spellStateRes, expectedSpell);
        });

        it("Air Shield", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            const spellState:  Effects.ActionEffectStruct = {
                points: 3,
                damageType: DamageType.PIERCING,
                damageSchool: SchoolType.UNKNOWN,
                setShields: false,
                addStatus: 0,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }

            const expectedSpell: Effects.ActionEffectStruct = {
                points: 0,
                damageType: DamageType.PIERCING,
                damageSchool: SchoolType.UNKNOWN,
                setShields: false,
                addStatus: 0,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }

            await mutations.addMutation(blockPiercing);
            const mut1 = await mutations.getMutation(1);
            assertMutation(mut1, blockPiercing, 1);

            await statuses.addStatus(getAirShield([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, getAirShield([1]), 1);

            const spellStateRes =
                await statuses.runPassiveStatuses(selfState, spellState);

            assertSpellState(spellStateRes, expectedSpell);
        });

        it("Depleted Air", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            const spellState:  Effects.ActionEffectStruct = {
                points: 3,
                damageType: DamageType.PIERCING,
                damageSchool: SchoolType.UNKNOWN,
                setShields: false,
                addStatus: 0,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }

            const expectedSpell: Effects.ActionEffectStruct = {
                points: 4,
                damageType: DamageType.PIERCING,
                damageSchool: SchoolType.UNKNOWN,
                setShields: false,
                addStatus: 0,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }

            await mutations.addMutation(increasePiercing);
            const mut1 = await mutations.getMutation(1);
            assertMutation(mut1, increasePiercing, 1);

            await statuses.addStatus(getDepletedAir([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, getDepletedAir([1]), 1);

            const spellStateRes =
                await statuses.runPassiveStatuses(selfState, spellState);

            assertSpellState(spellStateRes, expectedSpell);
        });

        it("Burns", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

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
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 9,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            await actions.addAction(deal1Piercing);
            const act1 = await actions.getAction(1);
            assertAction(act1, deal1Piercing, 1);

            await statuses.addStatus(getBurns([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, getBurns([1]), 1);

            const selfStateRes =
                await statuses.runActiveStatuses(selfState, opponentState, 1);

            assertMageStatus(selfStateRes, expectedState);
        });

        it("Ignition", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [2],
                turns: [1],
                isPass: false
            }

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
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 8,
                shields: 10,
                spells: [],
                statuses: [2],
                turns: [1],
                isPass: false
            }

            const expectedState2: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [2],
                isPass: false
            }

            await actions.addAction(deal1Piercing);
            await statuses.addStatus(getBurns([1]));

            await actions.addAction(deal2Piercing);
            const act1 = await actions.getAction(2);
            assertAction(act1, deal2Piercing, 2);

            await actions.addAction(getAddBurnsAction(1));
            const act2 = await actions.getAction(3);
            assertAction(act2, getAddBurnsAction(1), 3);

            await statuses.addStatus(getIgnition([2], [3]));
            const s1 = await statuses.getStatus(2);
            assertStatus(s1, getIgnition([2], [3]), 2);

            const selfStateRes =
                await statuses.runActiveStatuses(selfState, opponentState, 1);

            assertMageStatus(selfStateRes, expectedState);

            const selfStateRes2 =
                await statuses.decreaseStatusTurns(selfState, 2);

            assertMageStatus(selfStateRes2, expectedState2);
        });

        it("Ashen Shield", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [3],
                turns: [1],
                isPass: false
            }

            const spellState:  Effects.ActionEffectStruct = {
                points: 0,
                damageType: DamageType.UNKNOWN,
                damageSchool: SchoolType.UNKNOWN,
                setShields: false,
                addStatus: 1,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }

            const expectedSpell: Effects.ActionEffectStruct = {
                points: 0,
                damageType: DamageType.UNKNOWN,
                damageSchool: SchoolType.UNKNOWN,
                setShields: false,
                addStatus: 0,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }


            await actions.addAction(deal1Piercing);
            await statuses.addStatus(getBurns([1]));

            await actions.addAction(deal2Piercing);
            await actions.addAction(getAddBurnsAction(1));
            await statuses.addStatus(getIgnition([2], [3]));

            await mutations.addMutation(getBlockBurnsMutation(1));
            const mut1 = await mutations.getMutation(1);
            assertMutation(mut1, getBlockBurnsMutation(1), 1);

            await mutations.addMutation(getBlockIgnitionMutation(2));
            const mut2 = await mutations.getMutation(2);
            assertMutation(mut2, getBlockIgnitionMutation(2), 2);

            await statuses.addStatus(getAshenShield([1, 2]));
            const s1 = await statuses.getStatus(3);
            assertStatus(s1, getAshenShield([1, 2]), 3);

            const spellStateRes =
                await statuses.runPassiveStatuses(selfState, spellState);

            assertSpellState(spellStateRes, expectedSpell);
        });

        it("Fire Acolyte", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [3],
                turns: [2],
                isPass: false
            }

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
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [2],
                turns: [3],
                isPass: false
            }

            await actions.addAction(deal1Piercing);
            await statuses.addStatus(getBurns([1]));

            await actions.addAction(deal2Piercing);
            await actions.addAction(getAddBurnsAction(1));
            await statuses.addStatus(getIgnition([2], [3]));

            await actions.addAction(getChangeStatusToIgnitionAction(2));
            const act1 = await actions.getAction(4);
            assertAction(act1, getChangeStatusToIgnitionAction(2), 4);

            await statuses.addStatus(getFireAcolyte([4]));
            const s1 = await statuses.getStatus(3);
            assertStatus(s1, getFireAcolyte([4]), 3);

            const selfStateRes =
                await statuses.runActiveStatuses(selfState, opponentState, 3);

            assertMageStatus(selfStateRes, expectedState);
        });

        it("Wall of Fire", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [1],
                isPass: false
            }

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
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 9,
                shields: 11,
                spells: [],
                statuses: [1],
                turns: [1],
                isPass: false
            }

            await actions.addAction(deal1Piercing);
            await actions.addAction(deal1IncreaseShields);

            await statuses.addStatus(getWallOfFire([1, 2]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, getWallOfFire([1, 2]), 1);

            const selfStateRes =
                await statuses.runActiveStatuses(selfState, opponentState, 3);

            assertMageStatus(selfStateRes, expectedState);
        });

        it("I Am Fire", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            const spellState:  Effects.ActionEffectStruct = {
                points: 3,
                damageType: DamageType.CLASSIC,
                damageSchool: SchoolType.FIRE,
                setShields: false,
                addStatus: 0,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }

            const expectedSpell: Effects.ActionEffectStruct = {
                points: 3,
                damageType: DamageType.HEALING,
                damageSchool: SchoolType.FIRE,
                setShields: false,
                addStatus: 0,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }

            await mutations.addMutation(classicToHealingFire);

            await statuses.addStatus(getIAmFire([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, getIAmFire([1]), 1);

            const spellStateRes =
                await statuses.runPassiveStatuses(selfState, spellState);

            assertSpellState(spellStateRes, expectedSpell);
        });

        it("Grounding", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            const opponentState: States.FullStateStruct = {
                id: 1,
                name: "test2",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 9,
                spells: [],
                statuses: [],
                turns: [],
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 9,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            await actions.addAction(decreaseShields1IfShieldsMore0);

            await statuses.addStatus(getGrounding([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, getGrounding([1]), 1);

            const selfStateRes =
                await statuses.runActiveStatuses(selfState, opponentState, 3);

            assertMageStatus(selfStateRes, expectedState);
        });

        it("Shrapnel", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 0,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            const opponentState: States.FullStateStruct = {
                id: 1,
                name: "test2",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 9,
                spells: [],
                statuses: [],
                turns: [],
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 9,
                shields: 0,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            await actions.addAction(deal1ClassicIfShields0);

            await statuses.addStatus(getShrapnel([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, getShrapnel([1]), 1);

            const selfStateRes =
                await statuses.runActiveStatuses(selfState, opponentState, 3);

            assertMageStatus(selfStateRes, expectedState);
        });

        it("Skip turn", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 0,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            const opponentState: States.FullStateStruct = {
                id: 1,
                name: "test2",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 9,
                spells: [],
                statuses: [],
                turns: [],
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 0,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: true
            }

            await actions.addAction(skipTurn);

            await statuses.addStatus(stunning([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, stunning([1]), 1);

            const selfStateRes =
                await statuses.runActiveStatuses(selfState, opponentState, 3);

            assertMageStatus(selfStateRes, expectedState);
        });

        it("Abundant Growth", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 0,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            const opponentState: States.FullStateStruct = {
                id: 1,
                name: "test2",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 9,
                spells: [],
                statuses: [],
                turns: [],
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 1,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            await actions.addAction(deal1IncreaseShields);

            await statuses.addStatus(abundantGrowth([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, abundantGrowth([1]), 1);

            const selfStateRes =
                await statuses.runActiveStatuses(selfState, opponentState, 3);

            assertMageStatus(selfStateRes, expectedState);
        });

        it("Toxic Shock", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            const opponentState: States.FullStateStruct = {
                id: 1,
                name: "test2",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 9,
                spells: [],
                statuses: [],
                turns: [],
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 8,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            await actions.addAction(deal2Piercing);

            await statuses.addStatus(toxicShock([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, toxicShock([1]), 1);

            const selfStateRes =
                await statuses.runActiveStatuses(selfState, opponentState, 3);

            assertMageStatus(selfStateRes, expectedState);
        });

        it("Water Shield", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            const spellState:  Effects.ActionEffectStruct = {
                points: 3,
                damageType: DamageType.SHIELD_BRAKING,
                damageSchool: SchoolType.UNKNOWN,
                setShields: false,
                addStatus: 0,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }

            const expectedSpell: Effects.ActionEffectStruct = {
                points: 0,
                damageType: DamageType.SHIELD_BRAKING,
                damageSchool: SchoolType.UNKNOWN,
                setShields: false,
                addStatus: 0,
                burnStatus: 0,
                changeStatus: false,
                burnSpell: 0,
                addSpell: 0,
                burnAllStatuses: [],
                skip: false,
            }

            await mutations.addMutation(blockShieldDamage);

            await statuses.addStatus(waterShield([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, waterShield([1]), 1);

            const spellStateRes =
                await statuses.runPassiveStatuses(selfState, spellState);

            assertSpellState(spellStateRes, expectedSpell);
        });

        it("Poison", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            const opponentState: States.FullStateStruct = {
                id: 1,
                name: "test2",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 9,
                spells: [],
                statuses: [],
                turns: [],
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 9,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            await actions.addAction(deal1Piercing);

            await statuses.addStatus(poison([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, poison([1]), 1);

            const selfStateRes =
                await statuses.runActiveStatuses(selfState, opponentState, 3);

            assertMageStatus(selfStateRes, expectedState);
        });

        it("Deep Freeze", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: false
            }

            const opponentState: States.FullStateStruct = {
                id: 1,
                name: "test2",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 9,
                spells: [],
                statuses: [],
                turns: [],
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [3],
                isPass: true
            }

            await actions.addAction(skip30Chance);

            await statuses.addStatus(deepFreeze([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, deepFreeze([1]), 1);

            let res: boolean = false;
            for (let i = 0; i < 10; i++) {
                const selfStateRes =
                    await statuses.runActiveStatuses(selfState, opponentState, 3);
                await mine();

                res = res || selfStateRes.isPass;
                if (res) {
                    break;
                }

                // assertMageStatus(selfStateRes, expectedState);
            }

            expect(res).to.be.equal(true);
        });

        it.only("Purity", async function () {
            const {actions, statuses, mutations} = await loadFixture(deployFixture);

            const selfState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1, 2, 3, 4],
                turns: [4, 3, 2, 1],
                isPass: false
            }

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
                isPass: false
            }

            const expectedState: States.FullStateStruct = {
                id: 1,
                name: "test1",
                race: 1,
                school: SchoolType.FIRE,
                health: 10,
                shields: 10,
                spells: [],
                statuses: [1],
                turns: [4],
                isPass: false
            }

            await actions.addAction(burnAllStatuses);

            await statuses.addStatus(purity([1]));
            const s1 = await statuses.getStatus(1);
            assertStatus(s1, purity([1]), 1);

            const selfStateRes =
                await statuses.runActiveStatuses(selfState, opponentState, 3);
            assertMageStatus(selfStateRes, expectedState);
        });

        // it("Retribution", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [1],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [0],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await actions.addAction(burnSpellIfMaxHP);
        //
        //     await statuses.addStatus(retribution([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, retribution([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });
        //
        // it("Humility", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 20,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 11,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await mutations.addMutation(setDamageToHP);
        //
        //     await statuses.addStatus(humility([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, humility([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });
        //
        // it("Everything's Poison", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.HEALING,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await mutations.addMutation(healingToClassic);
        //
        //     await statuses.addStatus(everythingPoison([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, everythingPoison([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });
        //
        // it("From Generosity", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [1],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await actions.addAction(ifMaxHPAddLightningClassicSpell(1));
        //
        //     await statuses.addStatus(fromGenerosity([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, fromGenerosity([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });
        //
        // it("Regeneration", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 11,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await actions.addAction(deal1Healing);
        //
        //     await statuses.addStatus(regeneration([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, regeneration([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });
        //
        // it("Cool Aid", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 2,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await mutations.addMutation(decreaseDamage1IfDamageMoreThan1);
        //
        //     await statuses.addStatus(coolAid([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, coolAid([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });
        //
        // it("Reflection", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: [1, 2, 3, 4, 5]
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await mutations.addMutation(blockStatuses);
        //
        //     await statuses.addStatus(reflection([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, reflection([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });
        //
        // it("Gravemine", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState2: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 1,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await actions.addAction(deal9Classic);
        //
        //     await statuses.addStatus(gravemine([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, gravemine([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        //
        //     const selfStateRes2 =
        //         await statuses.runOnDestroy(1, selfState, opponentState);
        //
        //     assertMageStatus(selfStateRes2, expectedState2);
        // });
        //
        // it("Fear Feaster", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: true
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 11,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: true
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await actions.addAction(deal1PiercingIfSkip);
        //
        //     await statuses.addStatus(fearFeaster([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, fearFeaster([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });
        //
        // it("Decay and Rot", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [1],
        //         statuses: [],
        //         isPass: true
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [0],
        //         statuses: [],
        //         isPass: true
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await actions.addAction(burnSpellIfSkip);
        //
        //     await statuses.addStatus(decayAndRot([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, decayAndRot([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });
        //
        // it("Deep-seated Fears", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await actions.addAction(skip50Chance);
        //
        //     await statuses.addStatus(deepSeatedFears([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, deepSeatedFears([1]), 1);
        //
        //     let res: boolean = false;
        //     for (let i = 0; i < 10; i++) {
        //         const [selfStateRes, spellStateRes] =
        //             await statuses.runStatus(1, selfState, opponentState, spellState);
        //         await mine();
        //         assertSpellState(spellStateRes, expectedSpell);
        //
        //         res = res || selfStateRes.isPass;
        //         if (res) {
        //             break;
        //         }
        //
        //         // assertMageStatus(selfStateRes, expectedState);
        //     }
        //
        //     expect(res).to.be.equal(true);
        // });
        //
        // it("Dark Matter", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 5,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: true
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 5,
        //         shields: 12,
        //         spells: [],
        //         statuses: [],
        //         isPass: true
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await actions.addAction(deal2ShieldsIfHealthLessThan6);
        //
        //     await statuses.addStatus(darkMatter([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, darkMatter([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });
        //
        // it("Call of Cthulhu", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 12,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: true
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 11,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: true
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await actions.addAction(deal1PiercingIfHealthMoreThan6);
        //
        //     await statuses.addStatus(callOfCthulhu([1]));
        //     const s1 = await statuses.getStatus(1);
        //     assertStatus(s1, callOfCthulhu([1]), 1);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(1, selfState, opponentState, spellState);
        //     assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });
        //
        // it("What is Dead May Never Die", async function () {
        //     const {actions, statuses, mutations} = await loadFixture(deployFixture);
        //
        //     const selfState: MageState.FullStateStruct = {
        //         health: 0,
        //         shields: 0,
        //         spells: [],
        //         statuses: [],
        //         isPass: true
        //     }
        //
        //     const opponentState: MageState.FullStateStruct = {
        //         health: 10,
        //         shields: 10,
        //         spells: [],
        //         statuses: [],
        //         isPass: false
        //     }
        //
        //     const expectedState: MageState.FullStateStruct = {
        //         health: 1,
        //         shields: 0,
        //         spells: [],
        //         statuses: [1],
        //         isPass: true
        //     }
        //
        //     const spellState: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     const expectedSpell: SpellState.ShortMageEffectStruct = {
        //         points: 3,
        //         damage: DamageType.CLASSIC,
        //         school: SchoolType.FIRE,
        //         statuses: []
        //     }
        //
        //     await actions.addAction(skip50Chance);
        //     await statuses.addStatus(deepSeatedFears([1]));
        //
        //     await actions.addAction(addDeepSeatedFears(1));
        //     await actions.addAction(deal1HealingIfDead);
        //
        //     await statuses.addStatus(whaIsDeadMayNeverDie([2, 3]));
        //     const s1 = await statuses.getStatus(2);
        //     assertStatus(s1, whaIsDeadMayNeverDie([2, 3]), 2);
        //
        //     const [selfStateRes, spellStateRes] =
        //         await statuses.runStatus(2, selfState, opponentState, spellState);
        //     // assertSpellState(spellStateRes, expectedSpell);
        //     assertMageStatus(selfStateRes, expectedState);
        // });

    });
});