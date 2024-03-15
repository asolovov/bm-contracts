import { IActions } from "../../typechain-types";
import { expect } from "chai";
import { assertActionChecks } from "./checksHelpers";
import { ActionCheckType, ActionType, DamageType, SchoolType } from "../types/types";
import { assertUintArray } from "./commonHelpers";
import { SpellID, StatusID } from "./IDs";

export function assertAction(result: IActions.ActionStruct, target: IActions.ActionStruct, id: number) {
  expect(result.id).to.be.equal(id);
  expect(result.description).to.be.equal(target.description);
  expect(result.actionType).to.be.equal(target.actionType);
  expect(result.selfChecks.length).to.be.equal(target.selfChecks.length);
  expect(result.opponentChecks.length).to.be.equal(target.opponentChecks.length);
  expect(result.points.length).to.be.equal(target.points.length);
  expect(result.damage).to.be.equal(target.damage);
  expect(result.school).to.be.equal(target.school);
  expect(result.statusID).to.be.equal(target.statusID);
  expect(result.spellID).to.be.equal(target.spellID);

  assertUintArray(result.points, target.points);

  for (let i = 0; i < target.selfChecks.length; i++) {
    assertActionChecks(result.selfChecks[i], target.selfChecks[i]);
  }

  for (let i = 0; i < target.opponentChecks.length; i++) {
    assertActionChecks(result.opponentChecks[i], target.opponentChecks[i]);
  }
}

export const shields0_2Air: IActions.ActionStruct = {
  id: 0,
  description: "Increase shields 0-2 Air",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [0, 1, 2],
  damage: DamageType.INCREASE_SHIELDS,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export const heal0_2Air: IActions.ActionStruct = {
  id: 0,
  description: "Heal 0-2 Air",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [0, 1, 2],
  damage: DamageType.HEALING,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export const shields5Air: IActions.ActionStruct = {
  id: 0,
  description: "Shields +5 Air",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [5],
  damage: DamageType.INCREASE_SHIELDS,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export const breakShieldsAllAir: IActions.ActionStruct = {
  id: 0,
  description: "Break all shields",
  actionType: ActionType.SET_SHIELDS,
  selfChecks: [],
  opponentChecks: [],
  points: [0],
  damage: DamageType.UNKNOWN,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export const piercing2Air: IActions.ActionStruct = {
  id: 0,
  description: "Deal 2 piercing Air damage",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [2],
  damage: DamageType.PIERCING,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export const shields0Air: IActions.ActionStruct = {
  id: 0,
  description: "Increase shields 0 Air",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [0],
  damage: DamageType.INCREASE_SHIELDS,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export const classicDamage0Air: IActions.ActionStruct = {
  id: 0,
  description: "Deals 0 classic Air damage",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [0],
  damage: DamageType.CLASSIC,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export const classicDamage2_3Air: IActions.ActionStruct = {
  id: 0,
  description: "Deals 2-3 classic Air damage",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [2, 3],
  damage: DamageType.CLASSIC,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export const classicDamage1_2Air: IActions.ActionStruct = {
  id: 0,
  description: "Deals 1-2 classic damage",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [1, 2],
  damage: DamageType.CLASSIC,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export const classicDamage1Air: IActions.ActionStruct = {
  id: 0,
  description: "Deals 1 classic Air damage",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [1],
  damage: DamageType.CLASSIC,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export const classicDamage2Air: IActions.ActionStruct = {
  id: 0,
  description: "Deals 2 classic Air damage",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [2],
  damage: DamageType.CLASSIC,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export const burnSpellIfMaxHP: IActions.ActionStruct = {
  id: 0,
  description: "Burn one spell if HP is max",
  actionType: ActionType.BURN_SPELL,
  selfChecks: [
    {
      checkType: ActionCheckType.HEALTH_MORE,
      points: 11,
      statusID: 0,
      chance: 0,
    },
  ],
  opponentChecks: [],
  points: [],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const burnAllStatuses: IActions.ActionStruct = {
  id: 0,
  description: "Burn all statuses",
  actionType: ActionType.BURN_ALL_STATUSES,
  selfChecks: [],
  opponentChecks: [],
  points: [],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const decreaseShields1IfShieldsMore0: IActions.ActionStruct = {
  id: 0,
  description: "Decrease shields -1 is shields more than 0",
  actionType: ActionType.DAMAGE,
  selfChecks: [
    {
      checkType: ActionCheckType.SHIELDS_MORE,
      points: 0,
      statusID: 0,
      chance: 0,
    },
  ],
  opponentChecks: [],
  points: [1],
  damage: DamageType.SHIELD_BREAKING,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const deal1IncreaseShields: IActions.ActionStruct = {
  id: 0,
  description: "Increase shields +1",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [1],
  damage: DamageType.INCREASE_SHIELDS,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const skipTurn: IActions.ActionStruct = {
  id: 0,
  description: "Skip next turn",
  actionType: ActionType.SKIP_TURN,
  selfChecks: [],
  opponentChecks: [],
  points: [],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const skip30Chance: IActions.ActionStruct = {
  id: 0,
  description: "30% chance to skip turn",
  actionType: ActionType.SKIP_TURN,
  selfChecks: [
    {
      checkType: ActionCheckType.LUCK,
      points: 1,
      statusID: 0,
      chance: 30,
    },
  ],
  opponentChecks: [],
  points: [],
  damage: DamageType.CLASSIC,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const skip50Chance: IActions.ActionStruct = {
  id: 0,
  description: "50% chance to skip turn",
  actionType: ActionType.SKIP_TURN,
  selfChecks: [
    {
      checkType: ActionCheckType.LUCK,
      points: 1,
      statusID: 0,
      chance: 50,
    },
  ],
  opponentChecks: [],
  points: [],
  damage: DamageType.CLASSIC,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const deal2ShieldsIfHealthLessThan6: IActions.ActionStruct = {
  id: 0,
  description: "Deal 1 classic damage if shields are 0",
  actionType: ActionType.DAMAGE,
  selfChecks: [
    {
      checkType: ActionCheckType.HEALTH_LESS,
      points: 6,
      statusID: 0,
      chance: 0,
    },
  ],
  opponentChecks: [],
  points: [2],
  damage: DamageType.INCREASE_SHIELDS,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const deal9Classic: IActions.ActionStruct = {
  id: 0,
  description: "Deal 9 classic damage",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [9],
  damage: DamageType.CLASSIC,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const deal1Healing: IActions.ActionStruct = {
  id: 0,
  description: "Heal +1",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [1],
  damage: DamageType.HEALING,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const deal1HealingIfDead: IActions.ActionStruct = {
  id: 0,
  description: "Heal +1 if dead",
  actionType: ActionType.DAMAGE,
  selfChecks: [
    {
      checkType: ActionCheckType.HEALTH_LESS,
      points: 1,
      statusID: 0,
      chance: 0,
    },
  ],
  opponentChecks: [],
  points: [1],
  damage: DamageType.HEALING,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const deal1ClassicIfShields0: IActions.ActionStruct = {
  id: 0,
  description: "Deal 1 classic damage if shields are 0",
  actionType: ActionType.DAMAGE,
  selfChecks: [
    {
      checkType: ActionCheckType.SHIELDS_LESS,
      points: 1,
      statusID: 0,
      chance: 0,
    },
  ],
  opponentChecks: [],
  points: [1],
  damage: DamageType.CLASSIC,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const deal1PiercingIfSkip: IActions.ActionStruct = {
  id: 0,
  description: "Deal 1 piercing damage if skip turn",
  actionType: ActionType.DAMAGE,
  selfChecks: [
    {
      checkType: ActionCheckType.PASS,
      points: 0,
      statusID: 0,
      chance: 0,
    },
  ],
  opponentChecks: [],
  points: [1],
  damage: DamageType.PIERCING,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const deal1PiercingIfHealthMoreThan6: IActions.ActionStruct = {
  id: 0,
  description: "Deal 1 piercing damage if health is more than 6",
  actionType: ActionType.DAMAGE,
  selfChecks: [
    {
      checkType: ActionCheckType.HEALTH_MORE,
      points: 6,
      statusID: 0,
      chance: 0,
    },
  ],
  opponentChecks: [],
  points: [1],
  damage: DamageType.PIERCING,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const burnSpellIfSkip: IActions.ActionStruct = {
  id: 0,
  description: "Burn 1 spell if skip turn",
  actionType: ActionType.BURN_SPELL,
  selfChecks: [
    {
      checkType: ActionCheckType.PASS,
      points: 0,
      statusID: 0,
      chance: 0,
    },
  ],
  opponentChecks: [],
  points: [1],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const deal1Piercing: IActions.ActionStruct = {
  id: 0,
  description: "Deal 1 piercing damage",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [1],
  damage: DamageType.PIERCING,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export const deal2Piercing: IActions.ActionStruct = {
  id: 0,
  description: "Deal 2 piercing damage",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [],
  points: [2],
  damage: DamageType.PIERCING,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

export function getAddBurnsStatus(statusID: number): IActions.ActionStruct {
  return {
    id: 0,
    description: "Inflicts Burn status",
    actionType: ActionType.ADD_STATUS,
    selfChecks: [],
    opponentChecks: [],
    points: [],
    damage: DamageType.UNKNOWN,
    school: SchoolType.UNKNOWN,
    statusID: statusID,
    spellID: 0,
  };
}

export const addBurnsStatus: IActions.ActionStruct = {
  id: 0,
  description: "Inflicts Burn status",
  actionType: ActionType.ADD_STATUS,
  selfChecks: [],
  opponentChecks: [],
  points: [],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: StatusID.burns, // add burn status id
  spellID: 0,
};

export function getChangeStatusToIgnition(statusID: number): IActions.ActionStruct {
  return {
    id: 0,
    description: "Change random status to Ignition",
    actionType: ActionType.CHANGE_STATUS,
    selfChecks: [],
    opponentChecks: [],
    points: [],
    damage: DamageType.UNKNOWN,
    school: SchoolType.UNKNOWN,
    statusID: statusID,
    spellID: 0,
  };
}

export const changeStatusToIgnition: IActions.ActionStruct = {
  id: 0,
  description: "Change random status to Ignition",
  actionType: ActionType.CHANGE_STATUS,
  selfChecks: [],
  opponentChecks: [],
  points: [],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: StatusID.ignition, // add Ignition status id
  spellID: 0,
};

export function getIfMaxHPAddLightningClassicSpell(spellID: number): IActions.ActionStruct {
  return {
    id: 0,
    description: "If HP is max add Lightning Classic spell",
    actionType: ActionType.ADD_SPELL,
    selfChecks: [
      {
        checkType: ActionCheckType.HEALTH_MORE,
        points: 11,
        statusID: 0,
        chance: 0,
      },
    ],
    opponentChecks: [],
    points: [],
    damage: DamageType.UNKNOWN,
    school: SchoolType.UNKNOWN,
    statusID: 0,
    spellID: spellID,
  };
}

export const ifMaxHPAddLightningClassicSpell: IActions.ActionStruct = {
  id: 0,
  description: "If HP is max add Lightning Classic spell",
  actionType: ActionType.ADD_SPELL,
  selfChecks: [
    {
      checkType: ActionCheckType.HEALTH_MORE,
      points: 11,
      statusID: 0,
      chance: 0,
    },
  ],
  opponentChecks: [],
  points: [],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: SpellID.lightningClassic, // add Lightning Classic spell id
};

export function getAddDeepSeatedFears(statusID: number): IActions.ActionStruct {
  return {
    id: 0,
    description: "Add Deep-seated Fears if dead",
    actionType: ActionType.ADD_STATUS,
    selfChecks: [
      {
        checkType: ActionCheckType.HEALTH_LESS,
        points: 1,
        statusID: 0,
        chance: 0,
      },
    ],
    opponentChecks: [],
    points: [],
    damage: DamageType.UNKNOWN,
    school: SchoolType.UNKNOWN,
    statusID: statusID,
    spellID: 0,
  };
}

export const addDeepSeatedFears: IActions.ActionStruct = {
  id: 0,
  description: "Add Deep-seated Fears if dead",
  actionType: ActionType.ADD_STATUS,
  selfChecks: [
    {
      checkType: ActionCheckType.HEALTH_LESS,
      points: 1,
      statusID: 0,
      chance: 0,
    },
  ],
  opponentChecks: [],
  points: [],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: StatusID.deepSeatedFears, // add Deep-seated Fears status id
  spellID: 0,
};

export function getAddDepletedAir(statusID: number): IActions.ActionStruct {
  return {
    id: 0,
    description: "Add Depleted Air status",
    actionType: ActionType.ADD_STATUS,
    selfChecks: [],
    opponentChecks: [],
    points: [],
    damage: DamageType.UNKNOWN,
    school: SchoolType.UNKNOWN,
    statusID: statusID,
    spellID: 0,
  };
}

export const addDepletedAir: IActions.ActionStruct = {
  id: 0,
  description: "Add Depleted Air status",
  actionType: ActionType.ADD_STATUS,
  selfChecks: [],
  opponentChecks: [],
  points: [],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: StatusID.depletedAir, // add Depleted Air status id
  spellID: 0,
};

export function getClassic3AirIfStaticElStatus(statusID: number): IActions.ActionStruct {
  return {
    id: 0,
    description: "Deal 3 classic Air damage if Static Electricity status present",
    actionType: ActionType.DAMAGE,
    selfChecks: [],
    opponentChecks: [
      {
        checkType: ActionCheckType.STATUS,
        points: 0,
        statusID: statusID,
        chance: 0,
      },
    ],
    points: [3],
    damage: DamageType.CLASSIC,
    school: SchoolType.AIR,
    statusID: 0,
    spellID: 0,
  };
}

export const classic3AirIfStaticElStatus: IActions.ActionStruct = {
  id: 0,
  description: "Deal 3 classic Air damage if Static Electricity status present",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [
    {
      checkType: ActionCheckType.STATUS,
      points: 0,
      statusID: StatusID.staticElectricity, // add Static Electricity status id
      chance: 0,
    },
  ],
  points: [3],
  damage: DamageType.CLASSIC,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export function getClassic1AirIfNoStaticElStatus(statusID: number): IActions.ActionStruct {
  return {
    id: 0,
    description: "Deal 1 classic Air damage if no Static Electricity status present",
    actionType: ActionType.DAMAGE,
    selfChecks: [],
    opponentChecks: [
      {
        checkType: ActionCheckType.NO_STATUS,
        points: 0,
        statusID: statusID,
        chance: 0,
      },
    ],
    points: [1],
    damage: DamageType.CLASSIC,
    school: SchoolType.AIR,
    statusID: 0,
    spellID: 0,
  };
}

export const classic1AirIfNoStaticElStatus: IActions.ActionStruct = {
  id: 0,
  description: "Deal 1 classic Air damage if no Static Electricity status present",
  actionType: ActionType.DAMAGE,
  selfChecks: [],
  opponentChecks: [
    {
      checkType: ActionCheckType.NO_STATUS,
      points: 0,
      statusID: StatusID.staticElectricity, // add Static Electricity status id
      chance: 0,
    },
  ],
  points: [1],
  damage: DamageType.CLASSIC,
  school: SchoolType.AIR,
  statusID: 0,
  spellID: 0,
};

export function getAddStaticElectricity(statusID: number): IActions.ActionStruct {
  return {
    id: 0,
    description: "Add Static Electricity status",
    actionType: ActionType.ADD_STATUS,
    selfChecks: [],
    opponentChecks: [],
    points: [],
    damage: DamageType.UNKNOWN,
    school: SchoolType.UNKNOWN,
    statusID: statusID,
    spellID: 0,
  };
}

export const addStaticElectricity: IActions.ActionStruct = {
  id: 0,
  description: "Add Static Electricity status",
  actionType: ActionType.ADD_STATUS,
  selfChecks: [],
  opponentChecks: [],
  points: [],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: StatusID.staticElectricity, // add Static Electricity status id
  spellID: 0,
};

export function getAddAirShield(statusID: number): IActions.ActionStruct {
  return {
    id: 0,
    description: "Add Air Shield status",
    actionType: ActionType.ADD_STATUS,
    selfChecks: [],
    opponentChecks: [],
    points: [],
    damage: DamageType.UNKNOWN,
    school: SchoolType.UNKNOWN,
    statusID: statusID,
    spellID: 0,
  };
}

export const addAirShield: IActions.ActionStruct = {
  id: 0,
  description: "Add Air Shield status",
  actionType: ActionType.ADD_STATUS,
  selfChecks: [],
  opponentChecks: [],
  points: [],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: StatusID.airShield,
  spellID: 0,
};

export const blankAction: IActions.ActionStruct = {
  id: 0,
  description: "",
  actionType: ActionType.UNKNOWN,
  selfChecks: [],
  opponentChecks: [],
  points: [],
  damage: DamageType.UNKNOWN,
  school: SchoolType.UNKNOWN,
  statusID: 0,
  spellID: 0,
};

// ------ACHTUNG!!!------
// don`t edit this order. Add new only to the end of array and update enums

export const actions = [
  shields0_2Air,
  heal0_2Air,
  shields5Air,
  breakShieldsAllAir,
  piercing2Air,
  shields0Air,
  classicDamage0Air,
  classicDamage2_3Air,
  classicDamage1_2Air,
  classicDamage1Air,
  classicDamage2Air,
  burnSpellIfMaxHP,
  burnAllStatuses,
  decreaseShields1IfShieldsMore0,
  deal1IncreaseShields,
  skipTurn,
  skip30Chance,
  skip50Chance,
  deal2ShieldsIfHealthLessThan6,
  deal9Classic,
  deal1Healing,
  deal1HealingIfDead,
  deal1ClassicIfShields0,
  deal1PiercingIfSkip,
  deal1PiercingIfHealthMoreThan6,
  burnSpellIfSkip,
  deal1Piercing,
  deal2Piercing,
  addBurnsStatus,
  changeStatusToIgnition,
  ifMaxHPAddLightningClassicSpell,
  addDeepSeatedFears,
  addDepletedAir,
  classic3AirIfStaticElStatus,
  classic1AirIfNoStaticElStatus,
  addStaticElectricity,
  addAirShield,
];
