import {DamageType, SchoolType} from "../types/types";
import {expect} from "chai";
import {assertUintArray} from "./commonHelpers";
import {Effects} from "../../typechain-types/contracts/interfaces/IState";

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

export const blankActionEffect: Effects.ActionEffectStruct = {
    points: 0,
    damageType: DamageType.UNKNOWN,
    damageSchool: SchoolType.UNKNOWN,
    setShields: 0,
    addStatus: 0,
    burnStatus: 0,
    changeStatus: false,
    burnSpell: 0,
    addSpell: 0,
    burnAllStatuses: [],
    skip: false,
}