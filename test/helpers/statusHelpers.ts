import { IStatuses } from "../../typechain-types";
import { StatusType } from "../types/types";
import { expect } from "chai";
import { assertUintArray } from "./commonHelpers";

export function assertStatus(result: IStatuses.StatusStruct, target: IStatuses.StatusStruct, id: number) {
  expect(result.id).to.be.equal(id);
  expect(result.statusType).to.be.equal(target.statusType);
  expect(result.turns).to.be.equal(target.turns);
  expect(result.name).to.be.equal(target.name);
  expect(result.actions.length).to.be.equal(target.actions.length);
  expect(result.mutations.length).to.be.equal(target.mutations.length);
  expect(result.onDestroyActions.length).to.be.equal(target.onDestroyActions.length);

  assertUintArray(result.actions, target.actions);
  assertUintArray(result.mutations, target.mutations);
  assertUintArray(result.onDestroyActions, target.onDestroyActions);
}

export function whaIsDeadMayNeverDie(onDestroy: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.DEATH_CHECK,
    turns: 100,
    name: "What is Dead May Never Die",
    actions: [],
    mutations: [],
    onDestroyActions: onDestroy,
  };
}

export function callOfCthulhu(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 5,
    name: "Call of Cthulhu",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function darkMatter(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 5,
    name: "Dark Matter",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function deepSeatedFears(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 2,
    name: "Deep-seated Fears",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function decayAndRot(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 2,
    name: "Decay and Rot",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function fearFeaster(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 5,
    name: "Fear Feaster",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function gravemine(onDestroy: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 9,
    name: "Gravemine",
    actions: [],
    mutations: [],
    onDestroyActions: onDestroy,
  };
}

export function reflection(mutations: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.MUTATE_SPELL,
    turns: 3,
    name: "Reflection",
    actions: [],
    mutations: mutations,
    onDestroyActions: [],
  };
}

export function coolAid(mutations: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.MUTATE_SPELL,
    turns: 3,
    name: "Cool Aid",
    actions: [],
    mutations: mutations,
    onDestroyActions: [],
  };
}

export function regeneration(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 2,
    name: "Regeneration",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function fromGenerosity(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 2,
    name: "From Generosity",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function everythingPoison(mutations: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.MUTATE_SPELL,
    turns: 3,
    name: "Everything's Poison",
    actions: [],
    mutations: mutations,
    onDestroyActions: [],
  };
}

export function humility(mutations: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.MUTATE_SPELL,
    turns: 3,
    name: "Humility",
    actions: [],
    mutations: mutations,
    onDestroyActions: [],
  };
}

export function retribution(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 3,
    name: "Retribution",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function purity(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 2,
    name: "Purity",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function deepFreeze(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 3,
    name: "Deep Freeze",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function poison(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 3,
    name: "Poison",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function waterShield(mutations: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.MUTATE_SPELL,
    turns: 2,
    name: "Water Shield",
    actions: [],
    mutations: mutations,
    onDestroyActions: [],
  };
}

export function toxicShock(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 2,
    name: "Toxic Shock",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function abundantGrowth(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 2,
    name: "Abundant Growth",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function stunning(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 1,
    name: "Stunning",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function getShrapnel(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 3,
    name: "Shrapnel",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function getGrounding(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 3,
    name: "Grounding",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function getIAmFire(mutations: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.MUTATE_SPELL,
    turns: 5,
    name: "I Am Fire",
    actions: [],
    mutations: mutations,
    onDestroyActions: [],
  };
}

export function getWallOfFire(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 2,
    name: "Wall of Fire",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function getFireAcolyte(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 1,
    name: "Fire Acolyte",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function getAshenShield(mutations: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.MUTATE_SPELL,
    turns: 3,
    name: "Ashen Shield",
    actions: [],
    mutations: mutations,
    onDestroyActions: [],
  };
}

export function getIgnition(actions: number[], onDestroyActions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 1,
    name: "Ignition",
    actions: actions,
    mutations: [],
    onDestroyActions: onDestroyActions,
  };
}

export function getBurns(actions: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.BEFORE_SPELL,
    turns: 1,
    name: "Burns",
    actions: actions,
    mutations: [],
    onDestroyActions: [],
  };
}

export function getDepletedAir(mutations: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.MUTATE_SPELL,
    turns: 3,
    name: "Depleted Air",
    actions: [],
    mutations: mutations,
    onDestroyActions: [],
  };
}

export function getAirShield(mutations: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.MUTATE_SPELL,
    turns: 3,
    name: "Air Shield",
    actions: [],
    mutations: mutations,
    onDestroyActions: [],
  };
}

export function getStaticElectricity(mutations: number[]): IStatuses.StatusStruct {
  return {
    id: 0,
    statusType: StatusType.MUTATE_SPELL,
    turns: 3,
    name: "Static Electricity",
    actions: [],
    mutations: mutations,
    onDestroyActions: [],
  };
}
