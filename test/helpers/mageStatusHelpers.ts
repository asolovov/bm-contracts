import { expect } from "chai";
import { assertUintArray } from "./commonHelpers";
import { States } from "../../typechain-types/contracts/interfaces/IState";
import { SchoolType } from "../types/types";
import { BigNumberish } from "ethers";

export function mapUintArr(value: BigNumberish[]): number[] {
  const res: number[] = [];

  for (const v of value) {
    res.push(v as number);
  }

  return res;
}

export function mapMageState(mage: States.FullStateStruct): States.FullStateStruct {
  return {
    id: mage.id as number,
    name: mage.name as string,
    race: mage.race as number,
    school: mage.school as number,
    health: mage.health as number,
    shields: mage.shields as number,
    spells: mapUintArr(mage.spells),
    statuses: mapUintArr(mage.statuses),
    turns: mapUintArr(mage.turns),
    isPass: mage.isPass as boolean,
  };
}

export function assertMageStatus(result: States.FullStateStruct, target: States.FullStateStruct) {
  expect(result.health, "health").to.be.equal(target.health);
  expect(result.shields, "shields").to.be.equal(target.shields);
  expect(result.spells.length, "spells").to.be.equal(target.spells.length);
  expect(result.statuses.length, "statuses").to.be.equal(target.statuses.length);
  expect(result.turns.length, "turns").to.be.equal(target.turns.length);
  expect(result.isPass, "pass").to.be.equal(target.isPass);

  assertUintArray(result.spells, target.spells);
  assertUintArray(result.statuses, target.statuses);
  assertUintArray(result.turns, target.turns);
}

export function assertMageStatusApr(
  result: States.FullStateStruct,
  target: States.FullStateStruct,
  healthDelta: number,
  shieldsDelta: number,
) {
  expect(result.health, "health").to.be.approximately(target.health, healthDelta);
  expect(result.shields, "shields").to.be.approximately(target.shields, shieldsDelta);
  expect(result.spells.length).to.be.equal(target.spells.length);
  expect(result.statuses.length).to.be.equal(target.statuses.length);
  expect(result.turns.length).to.be.equal(target.turns.length);
  expect(result.isPass).to.be.equal(target.isPass);

  assertUintArray(result.spells, target.spells);
  assertUintArray(result.statuses, target.statuses);
  assertUintArray(result.turns, target.turns);
}
