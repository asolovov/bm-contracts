// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { School } from "./School.sol";
import { Damage } from "./Damage.sol";

library Effects {
    struct ActionEffect {
        uint8 points;
        Damage.Type damageType;
        School.Type damageSchool;
        bool setShields;
        uint256 addStatus;
        uint256 burnStatus;
        bool changeStatus;
        uint256[] burnAllStatuses;
        uint256 addSpell;
        uint256 burnSpell;
        bool skip;
    }
}
