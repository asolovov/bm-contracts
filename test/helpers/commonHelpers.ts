import { BigNumberish } from "ethers";
import { expect } from "chai";

export function assertUintArray(result: BigNumberish[], target: BigNumberish[]) {
  for (let i = 0; i < target.length; i++) {
    expect(result[i]).to.be.equal(target[i]);
  }
}
