import { IStatuses } from "../../typechain-types";
import { StatusType } from "../types/types";
import { ActionID, MutationID } from "./IDs";

export const whatIsDeadMayNeverDie: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.DEATH_CHECK,
  turns: 100,
  name: "What is Dead May Never Die",
  actions: [],
  mutations: [],
  onDestroyActions: [ActionID.deal1HealingIfDead, ActionID.addDeepSeatedFears],
};

export const callOfCthulhu: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 5,
  name: "Call of Cthulhu",
  actions: [ActionID.deal1PiercingIfHealthMoreThan6],
  mutations: [],
  onDestroyActions: [],
};

export const darkMatter: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 5,
  name: "Dark Matter",
  actions: [ActionID.deal2ShieldsIfHealthLessThan6],
  mutations: [],
  onDestroyActions: [],
};

export const deepSeatedFears: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 2,
  name: "Deep-seated Fears",
  actions: [ActionID.skip50Chance],
  mutations: [],
  onDestroyActions: [],
};

export const decayAndRot: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 2,
  name: "Decay and Rot",
  actions: [ActionID.burnSpellIfSkip],
  mutations: [],
  onDestroyActions: [],
};

export const fearFeaster: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 5,
  name: "Fear Feaster",
  actions: [ActionID.deal1PiercingIfSkip],
  mutations: [],
  onDestroyActions: [],
};

export const gravemine: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 9,
  name: "Gravemine",
  actions: [],
  mutations: [],
  onDestroyActions: [ActionID.deal9Classic],
};

export const reflection: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.MUTATE_SPELL,
  turns: 3,
  name: "Reflection",
  actions: [],
  mutations: [MutationID.blockStatuses],
  onDestroyActions: [],
};

export const coolAid: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.MUTATE_SPELL,
  turns: 3,
  name: "Cool Aid",
  actions: [],
  mutations: [MutationID.decreaseDamage1IfDamageMoreThan1],
  onDestroyActions: [],
};

export const regeneration: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 2,
  name: "Regeneration",
  actions: [ActionID.deal1Healing],
  mutations: [],
  onDestroyActions: [],
};

export const fromGenerosity: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 2,
  name: "From Generosity",
  actions: [ActionID.ifMaxHPAddLightningClassicSpell],
  mutations: [],
  onDestroyActions: [],
};

export const everythingPoison: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.MUTATE_SPELL,
  turns: 3,
  name: "Everything's Poison",
  actions: [],
  mutations: [MutationID.healingToClassic],
  onDestroyActions: [],
};

export const humility: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.MUTATE_SPELL,
  turns: 3,
  name: "Humility",
  actions: [],
  mutations: [MutationID.setDamageToHP],
  onDestroyActions: [],
};

export const retribution: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 3,
  name: "Retribution",
  actions: [ActionID.burnSpellIfMaxHP],
  mutations: [],
  onDestroyActions: [],
};

export const purity: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 2,
  name: "Purity",
  actions: [ActionID.burnAllStatuses],
  mutations: [],
  onDestroyActions: [],
};

export const deepFreeze: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 3,
  name: "Deep Freeze",
  actions: [ActionID.skip30Chance],
  mutations: [],
  onDestroyActions: [],
};

export const poison: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 3,
  name: "Poison",
  actions: [ActionID.deal1Piercing],
  mutations: [],
  onDestroyActions: [],
};

export const waterShield: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.MUTATE_SPELL,
  turns: 2,
  name: "Water Shield",
  actions: [],
  mutations: [MutationID.blockShieldDamage],
  onDestroyActions: [],
};

export const toxicShock: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 2,
  name: "Toxic Shock",
  actions: [ActionID.deal2Piercing],
  mutations: [],
  onDestroyActions: [],
};

export const abundantGrowth: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 2,
  name: "Abundant Growth",
  actions: [ActionID.deal1IncreaseShields],
  mutations: [],
  onDestroyActions: [],
};

export const stunning: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 1,
  name: "Stunning",
  actions: [ActionID.skipTurn],
  mutations: [],
  onDestroyActions: [],
};

export const shrapnel: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 3,
  name: "Shrapnel",
  actions: [ActionID.deal1ClassicIfShields0],
  mutations: [],
  onDestroyActions: [],
};

export const grounding: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 3,
  name: "Grounding",
  actions: [ActionID.decreaseShields1IfShieldsMore0],
  mutations: [],
  onDestroyActions: [],
};

export const iAmFire: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.MUTATE_SPELL,
  turns: 5,
  name: "I Am Fire",
  actions: [],
  mutations: [MutationID.classicToHealingFire],
  onDestroyActions: [],
};

export const wallOfFire: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 2,
  name: "Wall of Fire",
  actions: [ActionID.deal1Piercing, ActionID.deal1IncreaseShields],
  mutations: [],
  onDestroyActions: [],
};

export const fireAcolyte: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 1,
  name: "Fire Acolyte",
  actions: [ActionID.changeStatusToIgnition],
  mutations: [],
  onDestroyActions: [],
};

export const ashenShield: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.MUTATE_SPELL,
  turns: 3,
  name: "Ashen Shield",
  actions: [],
  mutations: [MutationID.blockBurnsMutation, MutationID.blockIgnitionMutation],
  onDestroyActions: [],
};

export const ignition: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 1,
  name: "Ignition",
  actions: [ActionID.deal2Piercing],
  mutations: [],
  onDestroyActions: [ActionID.addBurnsStatus],
};

export const burns: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.BEFORE_SPELL,
  turns: 1,
  name: "Burns",
  actions: [ActionID.deal1Piercing],
  mutations: [],
  onDestroyActions: [],
};

export const depletedAir: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.MUTATE_SPELL,
  turns: 3,
  name: "Depleted Air",
  actions: [],
  mutations: [MutationID.increasePiercing],
  onDestroyActions: [],
};

export const airShield: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.MUTATE_SPELL,
  turns: 3,
  name: "Air Shield",
  actions: [],
  mutations: [MutationID.blockPiercing],
  onDestroyActions: [],
};

export const staticElectricity: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.MUTATE_SPELL,
  turns: 3,
  name: "Static Electricity",
  actions: [],
  mutations: [MutationID.classicToPiercing],
  onDestroyActions: [],
};

export const blankStatus: IStatuses.StatusStruct = {
  id: 0,
  statusType: StatusType.UNKNOWN,
  turns: 0,
  name: "",
  actions: [],
  mutations: [],
  onDestroyActions: [],
};

// ------ACHTUNG!!!------
// don`t edit this order. Add new only to the end of array and update enums

export const statuses = [
  whatIsDeadMayNeverDie,
  callOfCthulhu,
  darkMatter,
  deepSeatedFears,
  decayAndRot,
  fearFeaster,
  gravemine,
  reflection,
  coolAid,
  regeneration,
  fromGenerosity,
  everythingPoison,
  humility,
  retribution,
  purity,
  deepFreeze,
  poison,
  waterShield,
  toxicShock,
  abundantGrowth,
  stunning,
  shrapnel,
  grounding,
  iAmFire,
  wallOfFire,
  fireAcolyte,
  ashenShield,
  ignition,
  burns,
  depletedAir,
  airShield,
  staticElectricity,
];
