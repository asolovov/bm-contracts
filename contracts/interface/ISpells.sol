// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {School} from "../utils/School.sol";
import {Target} from "../utils/Target.sol";
import {MageState} from "../utils/MageState.sol";

interface ISpells {

    struct Spell {
        uint256 id;
        string name;
        School.Type school;
        uint256[] selfActions;
        uint256[] opponentActions;
    }

    function getSpells() external view returns(Spell[] memory);

    function getSpell(uint256 id) external view returns(Spell memory);

    function getSchoolSpells(School.Type school) external view returns(Spell[] memory);

    function runSpell(
        uint256 id,
        Target.Type target,
        MageState.FullState memory self,
        MageState.FullState memory opponent
    ) external view returns(MageState.FullState memory);

}
