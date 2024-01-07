// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IMutations} from "../../interface/IMutations.sol";

import {Checks} from "../../utils/Checks.sol";
import {Damage} from "../../utils/Damage.sol";
import {School} from "../../utils/School.sol";
import {SpellState} from "../../utils/SpellState.sol";
import {MageState} from "../../utils/MageState.sol";

// MutationRegistry is an implementation for the IMutations interface
contract MutationRegistry is IMutations, Ownable {
    // New mutation ID
    uint256 private _nextID;

    // Mutations storage ID => Mutation struct
    mapping(uint256 => Mutation) private _mutations;

    constructor() Ownable(msg.sender){
        _nextID = 1;
    }

    /*
     * See {IMutations - getAllMutations}
    */
    function getAllMutations() external view returns (Mutation[] memory mutations) {
        for (uint256 i = 0; i < _nextID; i++) {
            mutations[i] = _mutations[i];
        }

        return mutations;
    }

    /*
     * See {IMutations - getMutation}
    */
    function getMutation(uint256 id) external view returns (Mutation memory) {
        return _mutations[id];
    }

    /*
     * See {IMutations - addMutation}
     * @dev adding Mutation to _mutations storage and increase _nextID var. Can be called only by the contract owner
    */
    function addMutation(Mutation memory mutation) external onlyOwner {
        Mutation storage m = _mutations[_nextID];
        m.id = _nextID;
        m.description = mutation.description;
        m.mutationType = mutation.mutationType;

        m.mutateDamage = mutation.mutateDamage;
        m.points = mutation.points;
        m.statusID = mutation.statusID;

        Checks.MutationCheck[] storage spell = m.spellChecks;
        for (uint256 i = 0; i < mutation.spellChecks.length; i++) {
            spell.push(mutation.spellChecks[i]);
        }

        m.spellChecks = spell;

        _nextID++;
    }

    /*
     * See {IMutations - runMutation}
     * @dev first will run checks for spell state. If all checks are ok will call _runMutation method for
     * spell state
    */
    function runMutation(
        uint256 id,
        SpellState.ShortMageEffect memory spellState,
        MageState.FullState memory mageState
    ) external view returns (SpellState.ShortMageEffect memory) {
        for (uint256 i = 0; i < _mutations[id].spellChecks.length; i++) {
            if(!Checks._runMutationCheck(mageState, spellState, _mutations[id].spellChecks[i])) {
                return spellState;
            }
        }

        return _runMutation(id, spellState, mageState);
    }

    /*
     * @dev will run Mutation for given Mutation ID and state. Will returned changed state.
    */
    function _runMutation(
        uint256 id,
        SpellState.ShortMageEffect memory spellState,
        MageState.FullState memory mageState
    ) private view returns (SpellState.ShortMageEffect memory) {
        if(_mutations[id].mutationType == Type.INCREASE_DAMAGE) {
            spellState.points += _mutations[id].points;
        }

        if(_mutations[id].mutationType == Type.DECREASE_DAMAGE) {
            if (spellState.points <= _mutations[id].points) {
                spellState.points = 0;
            } else {
                spellState.points -= _mutations[id].points;
            }
        }

        if(_mutations[id].mutationType == Type.CHANGE_DAMAGE_TYPE) {
            spellState.damage = _mutations[id].mutateDamage;
        }

        if(_mutations[id].mutationType == Type.SET_DAMAGE) {
            spellState.points = _mutations[id].points;
        }

        if(_mutations[id].mutationType == Type.SET_DAMAGE_TO_HP) {
            if (spellState.damage == Damage.Type.PIERCING || (spellState.damage == Damage.Type.CLASSIC && mageState.shields == 0)) {
                spellState.points = _mutations[id].points;
            } else if (spellState.damage == Damage.Type.CLASSIC && mageState.shields < spellState.points) {
                spellState.points = mageState.shields + 1;
            }
        }

        if(_mutations[id].mutationType == Type.BLOCK_SHIELD_DAMAGE) {
            if (mageState.shields > 0 && (spellState.damage == Damage.Type.CLASSIC || spellState.damage == Damage.Type.SHIELD_BRAKING)) {
                spellState.points = 0;
            }
        }

        if(_mutations[id].mutationType == Type.BLOCK_STATUS) {
            for (uint256 i = 0; i < spellState.statuses.length; i++) {
                if (spellState.statuses[i] == _mutations[id].statusID) {
                    spellState.statuses[i] = 0;
                }
            }
        }

        if(_mutations[id].mutationType == Type.BLOCK_ALL_STATUSES) {
            spellState.statuses = new uint256[](0);
        }

        return (spellState);
    }

}
