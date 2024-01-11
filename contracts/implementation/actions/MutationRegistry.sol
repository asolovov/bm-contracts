// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IMutations} from "../../interfaces/IMutations.sol";

import {Checks} from "../../utils/Checks.sol";
import {Damage} from "../../utils/Damage.sol";
import {School} from "../../utils/School.sol";
import {Effects} from "../../utils/Effects.sol";
import {States} from "../../utils/States.sol";

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
        Effects.ActionEffect memory spellState,
        States.FullState calldata mageState
    ) external view returns (Effects.ActionEffect memory) {
        for (uint256 i = 0; i < _mutations[id].spellChecks.length; i++) {
            if(!Checks._runMutationCheck(mageState, spellState, _mutations[id].spellChecks[i])) {
                return spellState;
            }
        }

        return _runMutation(_mutations[id], spellState, mageState);
    }

    /*
     * @dev will run Mutation for given Mutation ID and state. Will returned changed state.
    */
    function _runMutation(
        Mutation memory mutation,
        Effects.ActionEffect memory spellState,
        States.FullState calldata mageState
    ) private pure returns (Effects.ActionEffect memory) {
        if(mutation.mutationType == Type.INCREASE_DAMAGE) {
            spellState.points += mutation.points;
        }

        if(mutation.mutationType == Type.DECREASE_DAMAGE) {
            if (spellState.points <= mutation.points) {
                spellState.points = 0;
            } else {
                spellState.points -= mutation.points;
            }
        }

        if(mutation.mutationType == Type.CHANGE_DAMAGE_TYPE) {
            spellState.damageType = mutation.mutateDamage;
        }

        if(mutation.mutationType == Type.SET_DAMAGE) {
            spellState.points = mutation.points;
        }

        if(mutation.mutationType == Type.SET_DAMAGE_TO_HP) {
            if (
                spellState.damageType == Damage.Type.PIERCING ||
                (spellState.damageType == Damage.Type.CLASSIC && mageState.shields == 0)
            ) {
                spellState.points = mutation.points;
            } else if (spellState.damageType == Damage.Type.CLASSIC && mageState.shields < spellState.points) {
                spellState.points = mageState.shields + 1;
            }
        }

        if(mutation.mutationType == Type.BLOCK_SHIELD_DAMAGE) {
            if (
                mageState.shields > 0 &&
                (spellState.damageType == Damage.Type.CLASSIC || spellState.damageType == Damage.Type.SHIELD_BRAKING)
            ) {
                spellState.points = 0;
            }
        }

        if(mutation.mutationType == Type.BLOCK_STATUS) {
            if (spellState.addStatus == mutation.statusID) {
                spellState = _blockStatus(spellState);
            }
        }

        if(mutation.mutationType == Type.BLOCK_ALL_STATUSES) {
            spellState = _blockStatus(spellState);
        }

        return spellState;
    }

    function _blockStatus(
        Effects.ActionEffect memory spellState
    ) private pure returns(Effects.ActionEffect memory) {
        spellState.addStatus = 0;

        if (spellState.changeStatus) {
            spellState.burnStatus = 0;
            spellState.changeStatus = false;
        }

        return spellState;
    }

}
