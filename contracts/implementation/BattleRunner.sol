// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {IMages} from "../interfaces/IMages.sol";
import {IState} from "../interfaces/IState.sol";
import {IRace} from "../interfaces/IRace.sol";
import {IStatuses} from "../interfaces/IStatuses.sol";
import {ISpells} from "../interfaces/ISpells.sol";

import {States} from "../utils/States.sol";

contract BattleRunner {

    address private _mageRegistry;

    address private _stateRegistry;

    address private _raceRegistry;

    address private _statusRegistry;

    address private _spellsRegistry;

    uint8 private _maxTurns;

    struct Battle {
        uint256 ownerID;
        uint256[] ownerSpells;
        uint256 opponentID;
        uint256[] opponentSpells;
    }

    constructor(
        address mageRegistry,
        address stateRegistry,
        address raceRegistry,
        address statusRegistry,
        address spellRegistry,
        uint8 maxTurns
    ){
        _mageRegistry = mageRegistry;
        _stateRegistry = stateRegistry;
        _raceRegistry = raceRegistry;
        _statusRegistry = statusRegistry;
        _spellsRegistry = spellRegistry;
        _maxTurns = maxTurns;
    }

    function runBattle(Battle calldata battle) external view returns (uint256 winner) {
        States.FullState memory owner = States._getFullStateFromMage(
            IMages(_mageRegistry).getMage(battle.ownerID),
            battle.ownerSpells,
            IState(_stateRegistry).initialHealth(),
            IState(_stateRegistry).initialShields()
        );

        States.FullState memory opponent = States._getFullStateFromMage(
            IMages(_mageRegistry).getMage(battle.opponentID),
            battle.opponentSpells,
            IState(_stateRegistry).initialHealth(),
            IState(_stateRegistry).initialShields()
        );

        (owner, opponent) = IRace(_raceRegistry).applyRaceEffects(owner, opponent);
        (owner, opponent) = IRace(_raceRegistry).applyRaceEffects(opponent, owner);

        bool finish = false;
        for (uint8 t = 1; t <= _maxTurns || !finish; t++) {
            (winner, finish) = runTurn(owner, opponent, t);
        }

        if (!finish) {
            winner = _checkWinByHealth(owner, opponent);
        }

        return winner;
    }

    function runTurn(
        States.FullState memory owner,
        States.FullState memory opponent,
        uint8 turn
    ) public view returns (uint256 winnerID, bool finish) {
        owner = IStatuses(_statusRegistry).runActiveStatuses(owner, opponent, turn);
        opponent = IStatuses(_statusRegistry).runActiveStatuses(opponent, owner, turn);

        (finish, winnerID, owner, opponent) = _checkDead(owner, opponent, turn);
        if (finish) {
            return (winnerID, finish);
        }

        owner = ISpells(_spellsRegistry).runNextSpellSelf(owner, opponent);
        opponent = ISpells(_spellsRegistry).runNextSpellOpponent(opponent, owner);

        opponent = ISpells(_spellsRegistry).runNextSpellSelf(opponent, owner);
        owner = ISpells(_spellsRegistry).runNextSpellOpponent(owner, opponent);

        (finish, winnerID, owner, opponent) = _checkDead(owner, opponent, turn);
        if (finish) {
            return (winnerID, finish);
        }

        owner = IStatuses(_statusRegistry).decreaseStatusTurns(owner, turn);
        opponent = IStatuses(_statusRegistry).decreaseStatusTurns(opponent, turn);

        (finish, winnerID, owner, opponent) = _checkDead(owner, opponent, turn);
        if (finish) {
            return (winnerID, finish);
        }

        if (owner.spells.length == 0 && opponent.spells.length == 0) {
            return (_checkWinByHealth(owner, opponent), true);
        }

        return (0, false);
    }

    function _checkDead(
        States.FullState memory owner,
        States.FullState memory opponent,
        uint8 turn
    ) private view returns (
        bool,
        uint256,
        States.FullState memory,
        States.FullState memory
    ) {
        bool ownerDead;
        bool opponentDead;

        if (owner.health + opponent.health == 0) {
            (owner, ownerDead) = IStatuses(_statusRegistry).runDeathCheckStatuses(owner, turn);
            (opponent, opponentDead) = IStatuses(_statusRegistry).runDeathCheckStatuses(opponent, turn);
        }

        if (owner.health == 0) {
            (owner, ownerDead) = IStatuses(_statusRegistry).runDeathCheckStatuses(owner, turn);
        }

        if (opponent.health == 0) {
            (opponent, opponentDead) = IStatuses(_statusRegistry).runDeathCheckStatuses(opponent, turn);
        }

        if (ownerDead && opponentDead) {
            return (true, 0, owner, opponent);
        }

        if (ownerDead) {
            return (true, opponent.id, owner, opponent);
        }

        if (opponentDead) {
            return (true, owner.id, owner, opponent);
        }

        return (false, 0, owner, opponent);
    }

    function _checkWinByHealth(
        States.FullState memory owner,
        States.FullState memory opponent
    ) private pure returns (uint256) {
        if (owner.health > opponent.health) {
            return owner.id;
        }

        if (opponent.health > owner.health) {
            return opponent.id;
        }

        return 0;
    }

}
