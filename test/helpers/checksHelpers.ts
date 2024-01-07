
import {expect} from "chai";
import {Checks as MChecks} from "../../typechain-types/contracts/implementation/actions/MutationRegistry";
import {Checks as AChecks} from "../../typechain-types/contracts/implementation/actions/ActionRegistry";

export function assertSpellChecks(result: MChecks.MutationCheckStruct, target: MChecks.MutationCheckStruct) {
    expect(result.checkType).to.be.equal(target.checkType);
    expect(result.damageType).to.be.equal(target.damageType);
    expect(result.damageSchool).to.be.equal(target.damageSchool);
    expect(result.points).to.be.equal(target.points);
    expect(result.statusID).to.be.equal(target.statusID);
}

export function assertActionChecks(result:  AChecks.ActionCheckStruct, target:  AChecks.ActionCheckStruct) {
    expect(result.checkType).to.be.equal(target.checkType);
    expect(result.points).to.be.equal(target.points);
    expect(result.statusID).to.be.equal(target.statusID);
    expect(result.chance).to.be.equal(target.chance);
}