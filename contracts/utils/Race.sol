// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {MageState} from "./MageState.sol";

library  Race {

    struct PlayerEffects {
        MageState.ShortState increase;
        MageState.ShortState decrease;
        bool runSpells;
        bool setStatuses;
    }

    enum Type {
        UNKNOWN,
        ELF,
        ORC,
        UNDEAD
    }

    function _runStartGameEffects(Type race) internal pure returns(PlayerEffects memory owner, PlayerEffects memory opponent) {
        if (race == Type.ELF) {
            return _runElfEffects();
        } else if (race == Type.ORC) {
            return _runOrcEffects();
        } else if (race == Type.UNDEAD) {
            return _runUndeadEffects();
        }

        revert("Race: race cannot be unknown");
    }

    function _runElfEffects() private pure returns(PlayerEffects memory owner, PlayerEffects memory opponent) {
        return (
            PlayerEffects(MageState.ShortState(0, 0, 1), MageState.ShortState(1, 0, 0), false, false),
            PlayerEffects(MageState.ShortState(0, 0, 0), MageState.ShortState(0, 0, 0), false, false)
        );
    }

    function _runOrcEffects() private pure returns(PlayerEffects memory owner, PlayerEffects memory opponent) {
        return (
            PlayerEffects(MageState.ShortState(1, 0, 0), MageState.ShortState(0, 0, 0), false, false),
            PlayerEffects(MageState.ShortState(0, 0, 0), MageState.ShortState(0, 0, 0), false, false)
        );
    }

    function _runUndeadEffects() private pure returns(PlayerEffects memory owner, PlayerEffects memory opponent) {
        return (
            PlayerEffects(MageState.ShortState(0, 0, 0), MageState.ShortState(0, 0, 0), false, false),
            PlayerEffects(MageState.ShortState(0, 0, 0), MageState.ShortState(0, 0, 0), false, true)
        );
    }

}
