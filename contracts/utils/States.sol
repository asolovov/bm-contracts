// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { School } from "./School.sol";

library States {
    struct Mage {
        uint256 id;
        string name;
        uint256 race;
        School.Type school;
    }

    struct InitialState {
        uint256 id;
        string name;
        uint256 race;
        School.Type school;
        uint8 health;
        uint8 shields;
        uint256 sellsCount;
    }

    struct FullState {
        uint256 id;
        string name;
        uint256 race;
        School.Type school;
        uint8 health;
        uint8 shields;
        uint256[] spells;
        uint256[] statuses;
        uint8[] turns;
        bool isPass;
    }

    function _getFullStateFromMage(
        Mage memory mage,
        uint256[] calldata spells,
        uint8 health,
        uint8 shields
    ) internal pure returns (FullState memory) {
        FullState memory state;

        state.id = mage.id;
        state.name = mage.name;
        state.race = mage.race;
        state.school = mage.school;
        state.spells = spells;
        state.health = health;
        state.shields = shields;

        return state;
    }
}
