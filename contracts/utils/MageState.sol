// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

// MageState is used to memory store, transfer, change Mage state during the game
library  MageState {

    struct FullState {
        uint8 health;
        uint8 shields;
        uint256[] spells;
        uint256[] statuses;
        bool isPass;
    }

    struct ShortState {
        uint8 health;
        uint8 shields;
        uint256 spells;
    }
}
