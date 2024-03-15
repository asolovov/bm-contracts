// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Effects } from "./Effects.sol";
import { States } from "./States.sol";

// Damage is a library for running damage Actions. Library is implementing Damage effects on the Mage state.
library Damage {
    struct MaxValues {
        uint8 maxHealth;
        uint8 maxShields;
    }

    enum Type {
        UNKNOWN,
        CLASSIC,
        PIERCING,
        SHIELD_BREAKING,
        HEALING,
        INCREASE_SHIELDS
    }

    /*
     * @dev _runDamage is used to mutate given mage state with given points and damage type. Can be called by the Actions
     * contract. Can be reverted if given damage type is Unknown
     */
    function _runDamage(
        States.FullState memory state,
        Effects.ActionEffect calldata effect,
        MaxValues memory maxValues
    ) internal pure returns (States.FullState memory) {
        if (effect.damageType == Type.CLASSIC) {
            return _runClassic(state, effect.points);
        }

        if (effect.damageType == Type.PIERCING) {
            return _runPiercing(state, effect.points);
        }

        if (effect.damageType == Type.SHIELD_BREAKING) {
            return _runShieldBraking(state, effect.points);
        }

        if (effect.damageType == Type.HEALING) {
            return _runHealing(state, effect.points, maxValues);
        }

        if (effect.damageType == Type.INCREASE_SHIELDS) {
            return _runIncreaseShields(state, effect.points, maxValues);
        }

        revert("Damage: damage cannot be unknown");
    }

    /*
     * @dev _runClassic - classic damage first reduces the Mage shields and than reduces Mage health
     */
    function _runClassic(States.FullState memory state, uint8 points) private pure returns (States.FullState memory) {
        if (state.shields >= points) {
            state.shields -= points;
        } else if (state.shields > 0) {
            uint8 healthDamage = points - state.shields;
            state.shields = 0;
            state = _runPiercing(state, healthDamage);
        } else {
            state = _runPiercing(state, points);
        }

        return state;
    }

    /*
     * @dev _runPiercing - piercing damage reduces the Mage health
     */
    function _runPiercing(States.FullState memory state, uint8 points) private pure returns (States.FullState memory) {
        if (state.health <= points) {
            state.health = 0;
        } else {
            state.health -= points;
        }

        return state;
    }

    /*
     * @dev _runShieldBraking - reduces only the Mage shields
     */
    function _runShieldBraking(
        States.FullState memory state,
        uint8 points
    ) private pure returns (States.FullState memory) {
        if (state.shields > points) {
            state.shields -= points;
        } else {
            state.shields = 0;
        }

        return state;
    }

    /*
     * @dev _runShieldBraking - increases only the Mage health
     */
    function _runHealing(
        States.FullState memory state,
        uint8 points,
        MaxValues memory maxValues
    ) private pure returns (States.FullState memory) {
        if (state.health + points >= maxValues.maxHealth) {
            state.health = maxValues.maxHealth;
        } else {
            state.health += points;
        }

        return state;
    }

    /*
     * @dev _runIncreaseShields - increases only the Mage shields
     */
    function _runIncreaseShields(
        States.FullState memory state,
        uint8 points,
        MaxValues memory maxValues
    ) private pure returns (States.FullState memory) {
        if (state.shields + points >= maxValues.maxShields) {
            state.shields = maxValues.maxShields;
        } else {
            state.shields += points;
        }

        return state;
    }
}
