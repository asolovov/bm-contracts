import { Effects } from "../../typechain-types/contracts/interfaces/IState";
import { DamageType, SchoolType } from "../types/types";

export const defaultEffect: Effects.ActionEffectStruct = {
  points: 0,
  damageType: DamageType.UNKNOWN,
  damageSchool: SchoolType.UNKNOWN,
  setShields: false,
  addStatus: 0,
  burnStatus: 0,
  changeStatus: false,
  burnAllStatuses: [],
  addSpell: 0,
  burnSpell: 0,
  skip: false,
};

export function getEffect(params?: {
  points?: number;
  damageType?: DamageType;
  damageSchool?: SchoolType;
  setShields?: boolean;
  addStatus?: number;
  burnStatus?: number;
  changeStatus?: boolean;
  burnAllStatuses?: number[];
  addSpell?: number;
  burnSpell?: number;
  skip?: boolean;
}) {
  if (!params) {
    return defaultEffect;
  }

  const effect: Effects.ActionEffectStruct = {
    points: params.points ? params.points : 0,
    damageType: params.damageType ? params.damageType : DamageType.UNKNOWN,
    damageSchool: params.damageSchool ? params.damageSchool : SchoolType.UNKNOWN,
    setShields: params.setShields ? params.setShields : false,
    addStatus: params.addStatus ? params.addStatus : 0,
    burnStatus: params.burnStatus ? params.burnStatus : 0,
    changeStatus: params.changeStatus ? params.changeStatus : false,
    burnAllStatuses: params.burnAllStatuses ? params.burnAllStatuses : [],
    addSpell: params.addSpell ? params.addSpell : 0,
    burnSpell: params.burnSpell ? params.burnSpell : 0,
    skip: params.skip ? params.skip : false,
  };
  return effect;
}
