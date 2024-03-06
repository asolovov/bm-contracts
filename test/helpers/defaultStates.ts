import { States } from "../../typechain-types/contracts/interfaces/IState";
import { SchoolType } from "../types/types";

export const defaultState: States.FullStateStruct = {
  id: 1,
  name: "DefaultState",
  race: 1,
  school: SchoolType.FIRE,
  health: 10,
  shields: 0,
  spells: [],
  statuses: [],
  turns: [],
  isPass: false,
};

export function getState(params?: {
  id?: number;
  name?: string;
  race?: number;
  school?: SchoolType;
  health?: number;
  shields?: number;
  spells?: number[];
  statuses?: number[];
  turns?: number[];
  isPass?: boolean;
}): States.FullStateStruct {
  if (!params) {
    return defaultState;
  }

  const state: States.FullStateStruct = {
    id: params.id ? params.id : 1,
    name: params.name ? params.name : "DefaultState",
    race: params.race ? params.race : 1,
    school: params.school ? params.school : SchoolType.FIRE,
    health: params.health ? params.health : 10,
    shields: params.shields ? params.shields : 0,
    spells: params.spells ? params.spells : [],
    statuses: params.statuses ? params.statuses : [],
    turns: params.turns ? params.turns : [],
    isPass: params.isPass ? params.isPass : false,
  };

  return state;
}
