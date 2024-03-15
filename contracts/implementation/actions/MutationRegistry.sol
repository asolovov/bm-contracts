// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IMutations } from "../../interfaces/IMutations.sol";

import { Checks } from "../../utils/Checks.sol";
import { Damage } from "../../utils/Damage.sol";
import { School } from "../../utils/School.sol";
import { Effects } from "../../utils/Effects.sol";
import { States } from "../../utils/States.sol";

// MutationRegistry is an implementation for the IMutations interface
contract MutationRegistry is IMutations, Ownable {
    // New mutation ID
    uint256 private _nextID;

    // Mutations storage ID => Mutation struct
    mapping(uint256 => Mutation) private _mutations;

    constructor() Ownable(msg.sender) {
        _nextID = 1;
    }

    /*
     * See {IMutations - getAllMutations}
     */
    function getAllMutations() external view returns (Mutation[] memory mutations) {
        mutations = new Mutation[](_nextID - 1);
        for (uint256 i = 0; i < _nextID - 1; i++) {
            mutations[i] = _mutations[i + 1];
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
    function addMutation(Mutation calldata mutation) external onlyOwner {
        _mutations[_nextID] = mutation;
        _mutations[_nextID].id = _nextID;
        _nextID++;
    }

    /*
     * See {IMutations - runMutation}
     * @dev first will run checks for effect. If all checks are ok will call _runMutation method for
     * effect
     */
    function runMutation(
        uint256 id,
        Effects.ActionEffect memory effect,
        States.FullState calldata state
    ) external view returns (Effects.ActionEffect memory) {
        for (uint256 i = 0; i < _mutations[id].spellChecks.length; i++) {
            if (!Checks._runMutationCheck(state, effect, _mutations[id].spellChecks[i])) {
                return effect;
            }
        }

        return _runMutation(_mutations[id], effect, state);
    }

    /*
     * @dev will run Mutation for given effect and state. Will returned changed effect.
     */
    // Should use early return, to avoid all  unnecessary comparisons
    function _runMutation(
        Mutation memory mutation,
        Effects.ActionEffect memory effect,
        States.FullState calldata state
    ) private pure returns (Effects.ActionEffect memory) {
        if (mutation.mutationType == Type.INCREASE_DAMAGE) {
            effect.points += mutation.points;
        }

        if (mutation.mutationType == Type.DECREASE_DAMAGE) {
            if (effect.points <= mutation.points) {
                effect.points = 0;
            } else {
                effect.points -= mutation.points;
            }
        }

        if (mutation.mutationType == Type.CHANGE_DAMAGE_TYPE) {
            effect.damageType = mutation.mutateDamage;
        }

        if (mutation.mutationType == Type.SET_DAMAGE) {
            effect.points = mutation.points;
        }

        if (mutation.mutationType == Type.SET_DAMAGE_TO_HP) {
            if (
                effect.damageType == Damage.Type.PIERCING ||
                (effect.damageType == Damage.Type.CLASSIC && state.shields == 0)
            ) {
                effect.points = mutation.points;
            } else if (effect.damageType == Damage.Type.CLASSIC && state.shields < effect.points) {
                effect.points = state.shields + 1;
            }
        }

        if (mutation.mutationType == Type.BLOCK_SHIELD_DAMAGE) {
            if (
                state.shields > 0 &&
                (effect.damageType == Damage.Type.CLASSIC || effect.damageType == Damage.Type.SHIELD_BREAKING)
            ) {
                effect.points = 0;
            }
        }

        if (mutation.mutationType == Type.BLOCK_STATUS) {
            if (effect.addStatus == mutation.statusID) {
                effect = _blockStatus(effect);
            }
        }

        if (mutation.mutationType == Type.BLOCK_ALL_STATUSES) {
            effect = _blockStatus(effect);
        }

        return effect;
    }

    function _blockStatus(Effects.ActionEffect memory effect) private pure returns (Effects.ActionEffect memory) {
        effect.addStatus = 0;

        if (effect.changeStatus) {
            effect.burnStatus = 0;
            effect.changeStatus = false;
        }

        return effect;
    }
}
