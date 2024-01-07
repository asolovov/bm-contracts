// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {MageState} from "../utils/MageState.sol";

interface IBattle {

    enum Winner {
        UNKNOWN,
        DRAW,
        OWNER,
        OPPONENT
    }

    struct Battle {
        uint256 id;
        uint256 ownerID;
        uint256 opponentID;
        uint256 turns;
        uint256 time;
        Winner winner;
    }

    function getBattle(uint256 id) external view returns(Battle memory);

    function registerBattle(
        uint256 ownerID,
        uint256 opponentID,
        uint256 time
    ) external;

    function runBattle(uint256 id) external;

    function watchLogs(
        uint256 id,
        uint256 turn
    ) external view returns(MageState.FullState memory owner, MageState.FullState memory opponent);

}
