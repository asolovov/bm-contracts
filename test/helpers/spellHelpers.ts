import { expect } from "chai";
import { assertUintArray } from "./commonHelpers";
import { Effects } from "../../typechain-types/contracts/interfaces/IState";
import { ISpells } from "../../typechain-types";
import { SchoolType } from "../types/types";

export function assertSpellState(result: Effects.ActionEffectStruct, target: Effects.ActionEffectStruct) {
  expect(result.points, "points").to.be.equal(target.points);
  expect(result.damageType, "damage type").to.be.equal(target.damageType);
  expect(result.damageSchool, "school").to.be.equal(target.damageSchool);
  expect(result.setShields, "setShields").to.be.equal(target.setShields);
  expect(result.addStatus, "addStatus").to.be.equal(target.addStatus);
  expect(result.burnStatus, "burnStatus").to.be.equal(target.burnStatus);
  expect(result.changeStatus, "changeStatus").to.be.equal(target.changeStatus);
  expect(result.addSpell, "addSpell").to.be.equal(target.addSpell);
  expect(result.burnSpell, "burnSpell").to.be.equal(target.burnSpell);
  expect(result.skip, "skip").to.be.equal(target.skip);
  expect(result.burnAllStatuses.length, "burnAllStatuses").to.be.equal(target.burnAllStatuses.length);

  assertUintArray(result.burnAllStatuses, target.burnAllStatuses);
}

export function assertSpell(result: ISpells.SpellStruct, target: ISpells.SpellStruct) {
  expect(result.id).to.be.equal(target.id);
  expect(result.name).to.be.equal(target.name);
  expect(result.school).to.be.equal(target.school);
  expect(result.selfActions.length).to.be.equal(target.selfActions.length);
  expect(result.opponentActions.length).to.be.equal(target.opponentActions.length);

  assertUintArray(result.selfActions, target.selfActions);
  assertUintArray(result.opponentActions, target.opponentActions);
}

export function megaVoltWunderwaffle(actionsOpponent: number[]): ISpells.SpellStruct {
  return {
    id: 0,
    name: "Mega Volt Wunderwaffle",
    school: SchoolType.AIR,
    selfActions: [],
    opponentActions: actionsOpponent,
  };
}

export function powerSurge(actionsOpponent: number[]): ISpells.SpellStruct {
  return {
    id: 0,
    name: "Power Surge",
    school: SchoolType.AIR,
    selfActions: [],
    opponentActions: actionsOpponent,
  };
}

export function blitzkriegByte(actionsOpponent: number[]): ISpells.SpellStruct {
  return {
    id: 0,
    name: "Blitzkrieg Byte",
    school: SchoolType.AIR,
    selfActions: [],
    opponentActions: actionsOpponent,
  };
}

export function teslasTrick(actionsSelf: number[]): ISpells.SpellStruct {
  return {
    id: 0,
    name: "Tesla's Trick",
    school: SchoolType.AIR,
    selfActions: actionsSelf,
    opponentActions: [],
  };
}

export function doubleTroubleThunder(actionsSelf: number[], actionsOpponent: number[]): ISpells.SpellStruct {
  return {
    id: 0,
    name: "Double Trouble Thunder",
    school: SchoolType.AIR,
    selfActions: actionsSelf,
    opponentActions: actionsOpponent,
  };
}

export function zephyrZipline(actionsOpponent: number[]): ISpells.SpellStruct {
  return {
    id: 0,
    name: "Zephyr Zipline",
    school: SchoolType.AIR,
    selfActions: [],
    opponentActions: actionsOpponent,
  };
}

export function aeroAssault(actionsSelf: number[]): ISpells.SpellStruct {
  return {
    id: 0,
    name: "Aero Assault",
    school: SchoolType.AIR,
    selfActions: actionsSelf,
    opponentActions: [],
  };
}
export function lightningClassic(actionsOpponent: number[]): ISpells.SpellStruct {
  return {
    id: 0,
    name: "Lightning Classic",
    school: SchoolType.AIR,
    selfActions: [],
    opponentActions: actionsOpponent,
  };
}

export function thunderstruckTwirl(actionsOpponent: number[]): ISpells.SpellStruct {
  return {
    id: 0,
    name: "Thunderstruck Twirl",
    school: SchoolType.AIR,
    selfActions: [],
    opponentActions: actionsOpponent,
  };
}

export function zeldasZigzag(actionsSelf: number[]): ISpells.SpellStruct {
  return {
    id: 0,
    name: "Zelda's Zigzag",
    school: SchoolType.AIR,
    selfActions: actionsSelf,
    opponentActions: [],
  };
}
