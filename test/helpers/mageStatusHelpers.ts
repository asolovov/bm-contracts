import {expect} from "chai";
import {assertUintArray} from "./commonHelpers";
import {States} from "../../typechain-types/contracts/interfaces/IState";

export function assertMageStatus(result: States.FullStateStruct, target: States.FullStateStruct) {
    expect(result.health, "health").to.be.equal(target.health);
    expect(result.shields).to.be.equal(target.shields);
    expect(result.spells.length).to.be.equal(target.spells.length);
    expect(result.statuses.length).to.be.equal(target.statuses.length);
    expect(result.turns.length).to.be.equal(target.turns.length);
    expect(result.isPass).to.be.equal(target.isPass);

    assertUintArray(result.spells, target.spells);
    assertUintArray(result.statuses, target.statuses);
    assertUintArray(result.turns, target.turns);
}