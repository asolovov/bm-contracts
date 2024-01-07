import {SpellState} from "../../typechain-types/contracts/implementation/status/StatusRegistry";
import {DamageType, SchoolType} from "../types/types";
import {expect} from "chai";
import {assertUintArray} from "./commonHelpers";

export function assertSpellState(result: SpellState.ShortMageEffectStruct, target: SpellState.ShortMageEffectStruct) {
    expect(result.points, "points").to.be.equal(target.points);
    expect(result.damage, "damage type").to.be.equal(target.damage);
    expect(result.school, "school").to.be.equal(target.school);
    expect(result.statuses.length, "status length").to.be.equal(target.statuses.length);

    assertUintArray(result.statuses, target.statuses);
}

export const blankSpellState: SpellState.ShortMageEffectStruct = {
    points: 0,
    damage: DamageType.UNKNOWN,
    school: SchoolType.UNKNOWN,
    statuses: []
}