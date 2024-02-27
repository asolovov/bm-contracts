// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { States } from "../utils/States.sol";

interface IRace {
    struct Race {
        uint256 id;
        string name;
        uint256[] selfActions;
        uint256[] opponentActions;
    }

    function addRace(Race calldata race) external;

    function getRace(uint256 id) external view returns (Race memory);

    function getAllRaces() external view returns (Race[] memory);

    function applyRaceEffects(
        States.FullState memory self,
        States.FullState memory opponent
    ) external view returns (States.FullState memory, States.FullState memory);
}
