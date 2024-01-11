// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {School} from "../utils/School.sol";
import {Target} from "../utils/Target.sol";
import "../utils/States.sol";

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

    function runNextSpellSelf(
        States.FullState memory self,
        States.FullState calldata opponent
    ) external view returns(States.FullState memory);

    function runNextSpellOpponent(
        States.FullState calldata self,
        States.FullState memory opponent
    ) external view returns(States.FullState memory);

}
