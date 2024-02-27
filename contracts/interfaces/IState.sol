// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Effects } from "../utils/Effects.sol";
import { States } from "../utils/States.sol";

interface IState {
    function setInitialHealth(uint8 health) external;

    function setInitialShields(uint8 shields) external;

    function setMaxShields(uint8 shields) external;

    function setInitialSpells(uint256 spells) external;

    function initialHealth() external view returns (uint8);

    function initialShields() external view returns (uint8);

    function maxShields() external view returns (uint8);

    function initialSpells() external view returns (uint256);

    function applyActionEffects(
        Effects.ActionEffect calldata effect,
        States.FullState memory state,
        uint8 turn
    ) external view returns (States.FullState memory);
}
