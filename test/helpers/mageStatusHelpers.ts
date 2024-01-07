import {MageState} from "../../typechain-types/contracts/implementation/status/StatusRegistry";
import {expect} from "chai";
import {assertUintArray} from "./commonHelpers";

export function assertMageStatus(result: MageState.FullStateStruct, target: MageState.FullStateStruct) {
    expect(result.health, "health").to.be.equal(target.health);
    expect(result.shields).to.be.equal(target.shields);
    expect(result.spells.length).to.be.equal(target.spells.length);
    expect(result.statuses.length).to.be.equal(target.statuses.length);
    expect(result.isPass).to.be.equal(target.isPass);

    assertUintArray(result.spells, target.spells);
    assertUintArray(result.statuses, target.statuses);
}