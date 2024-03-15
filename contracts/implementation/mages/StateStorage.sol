// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { IState } from "../../interfaces/IState.sol";

import { Effects } from "../../utils/Effects.sol";
import { States } from "../../utils/States.sol";
import { Damage } from "../../utils/Damage.sol";

contract StateStorage is IState {
    uint8 private _initialHeath;
    uint8 private _initialShields;
    uint8 private _maxShields;
    uint256 private _initialSpells;

    constructor() {
        _initialHeath = 12;
        _initialShields = 0;
        _maxShields = 20;
        _initialSpells = 10;
    }

    function setInitialHealth(uint8 health) external {
        _initialHeath = health;
    }

    function setInitialShields(uint8 shields) external {
        _initialShields = shields;
    }

    function setMaxShields(uint8 shields) external {
        _maxShields = shields;
    }

    function setInitialSpells(uint256 spells) external {
        _initialSpells = spells;
    }

    function initialHealth() external view returns (uint8) {
        return _initialHeath;
    }

    function initialShields() external view returns (uint8) {
        return _initialShields;
    }

    function maxShields() external view returns (uint8) {
        return _maxShields;
    }

    function initialSpells() external view returns (uint256) {
        return _initialSpells;
    }

    function applyActionEffects(
        Effects.ActionEffect calldata effect,
        States.FullState memory state,
        uint8 turn
    ) external view returns (States.FullState memory) {
        if (effect.damageType != Damage.Type.UNKNOWN) {
            state = Damage._runDamage(state, effect, Damage.MaxValues(_initialHeath, _maxShields));
        }

        if (effect.setShields) {
            state.shields = effect.points;
        }

        if (effect.skip) {
            state.isPass = effect.skip;
        }

        if (effect.addStatus != 0) {
            state.statuses = _addID(state.statuses, effect.addStatus);
            state.turns = _addID8(state.turns, turn);
        }

        if (effect.burnStatus != 0) {
            (state.statuses, state.turns) = _removeStatus(state.statuses, state.turns, effect.burnStatus);
        }

        if (effect.addSpell != 0) {
            state.spells = _addID(state.spells, effect.addSpell);
        }

        if (effect.burnSpell != 0) {
            state.spells = _removeID(state.spells, effect.burnSpell);
        }

        if (effect.burnAllStatuses.length > 0) {
            (state.statuses, state.turns) = _removeStatuses(state.statuses, state.turns, effect.burnAllStatuses);
        }

        return state;
    }

    function _removeStatus(
        uint256[] memory statuses,
        uint8[] memory turns,
        uint256 idToRemove
    ) private pure returns (uint256[] memory, uint8[] memory) {
        uint256[] memory newIDs = new uint256[](statuses.length - 1);
        uint8[] memory newTurns = new uint8[](statuses.length - 1);

        uint256 l;
        for (uint256 i = 0; i < statuses.length; i++) {
            if (statuses[i] != idToRemove) {
                newIDs[l] = statuses[i];
                newTurns[l] = turns[i];
                l++;
            }
        }

        return (newIDs, newTurns);
    }

    function _removeStatuses(
        uint256[] memory ids,
        uint8[] memory turns,
        uint256[] memory idsToRemove
    ) private pure returns (uint256[] memory, uint8[] memory) {
        uint256[] memory newIDs = new uint256[](ids.length - idsToRemove.length);
        uint8[] memory newTurns = new uint8[](ids.length - idsToRemove.length);

        if (newIDs.length == 0) {
            return (newIDs, newTurns);
        }

        uint256 l;
        for (uint256 i = 0; i < ids.length; i++) {
            bool remove;
            for (uint256 j = 0; j < idsToRemove.length; j++) {
                if (ids[i] == idsToRemove[j]) {
                    remove = true;
                    break;
                }
            }

            if (!remove) {
                newIDs[l] = ids[i];
                newTurns[l] = turns[i];
                l++;
            }
        }

        return (newIDs, newTurns);
    }

    function _removeID(uint256[] memory ids, uint256 id) private pure returns (uint256[] memory) {
        uint256[] memory newIDs = new uint256[](ids.length - 1);

        uint256 l;
        for (uint256 i = 0; i < ids.length; i++) {
            if (ids[i] != id) {
                newIDs[l] = ids[i];
                l++;
            }
        }

        return newIDs;
    }

    function _addID8(uint8[] memory ids, uint8 id) private pure returns (uint8[] memory) {
        uint8[] memory newIDs = new uint8[](ids.length + 1);

        for (uint8 i = 0; i < ids.length; i++) {
            newIDs[i] = ids[i];
        }

        newIDs[ids.length] = id;

        return newIDs;
    }

    function _addID(uint256[] memory ids, uint256 id) private pure returns (uint256[] memory) {
        uint256[] memory newIDs = new uint256[](ids.length + 1);

        for (uint256 i = 0; i < ids.length; i++) {
            newIDs[i] = ids[i];
        }

        newIDs[ids.length] = id;

        return newIDs;
    }
}
