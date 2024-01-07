// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "./Damage.sol";
import "./School.sol";

// SpellState is used to memory store, transfer, change Spell state during the game
library SpellState {

    struct ShortMageEffect {
        uint8 points;
        Damage.Type damage;
        School.Type school;
        uint256[] statuses;
    }

    struct MageEffect {
        uint8[] points;
        Damage.Type damage;
        School.Type school;
        uint256[] statuses;
    }

    struct FullState {
        MageEffect self;
        MageEffect opponent;
    }

}
