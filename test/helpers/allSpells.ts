import { ISpells } from "../../typechain-types";
import { SchoolType } from "../types/types";
import { ActionID } from "./IDs";

export const megaVoltWunderwaffle: ISpells.SpellStruct = {
  id: 0,
  name: "Mega Volt Wunderwaffle",
  school: SchoolType.AIR,
  selfActions: [],
  opponentActions: [ActionID.classicDamage2Air, ActionID.addStaticElectricity],
};

export const powerSurge: ISpells.SpellStruct = {
  id: 0,
  name: "Power Surge",
  school: SchoolType.AIR,
  selfActions: [],
  opponentActions: [ActionID.classicDamage1_2Air, ActionID.addDepletedAir],
};

export const blitzkriegByte: ISpells.SpellStruct = {
  id: 0,
  name: "Blitzkrieg Byte",
  school: SchoolType.AIR,
  selfActions: [],
  opponentActions: [ActionID.classic3AirIfStaticElStatus, ActionID.classic1AirIfNoStaticElStatus],
};

export const teslasTrick: ISpells.SpellStruct = {
  id: 0,
  name: "Tesla's Trick",
  school: SchoolType.AIR,
  selfActions: [ActionID.shields0_2Air, ActionID.heal0_2Air],
  opponentActions: [],
};

export const doubleTroubleThunder: ISpells.SpellStruct = {
  id: 0,
  name: "Double Trouble Thunder",
  school: SchoolType.AIR,
  selfActions: [ActionID.addStaticElectricity],
  opponentActions: [ActionID.classicDamage2_3Air, ActionID.addStaticElectricity],
};

export const zephyrZipline: ISpells.SpellStruct = {
  id: 0,
  name: "Zephyr Zipline",
  school: SchoolType.AIR,
  selfActions: [],
  opponentActions: [ActionID.classicDamage0Air, ActionID.addStaticElectricity, ActionID.addDepletedAir],
};

export const aeroAssault: ISpells.SpellStruct = {
  id: 0,
  name: "Aero Assault",
  school: SchoolType.AIR,
  selfActions: [ActionID.shields0Air, ActionID.addAirShield],
  opponentActions: [],
};

export const lightningClassic: ISpells.SpellStruct = {
  id: 0,
  name: "Lightning Classic",
  school: SchoolType.AIR,
  selfActions: [],
  opponentActions: [ActionID.piercing2Air],
};

export const thunderstruckTwirl: ISpells.SpellStruct = {
  id: 0,
  name: "Thunderstruck Twirl",
  school: SchoolType.AIR,
  selfActions: [],
  opponentActions: [ActionID.breakShieldsAllAir, ActionID.classicDamage1Air],
};

export const zeldasZigzag: ISpells.SpellStruct = {
  id: 0,
  name: "Zelda's Zigzag",
  school: SchoolType.AIR,
  selfActions: [ActionID.shields5Air, ActionID.addDepletedAir],
  opponentActions: [],
};

export const blankSpell: ISpells.SpellStruct = {
  id: 0,
  name: "",
  school: SchoolType.UNKNOWN,
  selfActions: [],
  opponentActions: [],
};

// ------ACHTUNG!!!------
// don`t edit this order. Add new only to the end of array and update enums

export const spells = [
  megaVoltWunderwaffle,
  powerSurge,
  blitzkriegByte,
  teslasTrick,
  doubleTroubleThunder,
  zephyrZipline,
  aeroAssault,
  lightningClassic,
  thunderstruckTwirl,
  zeldasZigzag,
];
