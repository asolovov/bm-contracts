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
        SHIELD_BRAKING,
        HEALING,
        INCREASE_SHIELDS
    }

    /*
     * @dev _runDamage is used to mutate given mage state with given points and damage type. Can be called by the Actions
     * contract. Can be reverted if given damage type is Unknown
     */
    function _runDamage(
        States.FullState memory mage,
        Effects.ActionEffect calldata effect,
        MaxValues memory maxValues
    ) internal pure returns (States.FullState memory) {
        if (effect.damageType == Type.CLASSIC) {
            return _runClassic(mage, effect.points);
        }

        if (effect.damageType == Type.PIERCING) {
            return _runPiercing(mage, effect.points);
        }

        if (effect.damageType == Type.SHIELD_BRAKING) {
            return _runShieldBraking(mage, effect.points);
        }

        if (effect.damageType == Type.HEALING) {
            return _runHealing(mage, effect.points, maxValues);
        }

        if (effect.damageType == Type.INCREASE_SHIELDS) {
            return _runIncreaseShields(mage, effect.points, maxValues);
        }

        revert("Damage: damage cannot be unknown");
    }

    /*
     * @dev _runClassic - classic damage first reduces the Mage shields and than reduces Mage health
     */
    function _runClassic(States.FullState memory mage, uint8 points) private pure returns (States.FullState memory) {
        if (mage.shields >= points) {
            mage.shields -= points;
        } else if (mage.shields > 0) {
            uint8 healthDamage = points - mage.shields;
            mage.shields = 0;
            mage.health -= healthDamage;
        } else {
            mage = _runPiercing(mage, points);
        }

        return mage;
    }

    /*
     * @dev _runPiercing - piercing damage reduces the Mage health
     */
    function _runPiercing(States.FullState memory mage, uint8 points) private pure returns (States.FullState memory) {
        if (mage.health <= points) {
            mage.health = 0;
        } else {
            mage.health -= points;
        }

        return mage;
    }

    /*
     * @dev _runShieldBraking - reduces only the Mage shields
     */
    function _runShieldBraking(
        States.FullState memory mage,
        uint8 points
    ) private pure returns (States.FullState memory) {
        if (mage.shields > points) {
            mage.shields -= points;
        } else if (mage.shields > 0) {
            mage.shields = 0;
        }

        return mage;
    }

    /*
     * @dev _runShieldBraking - increases only the Mage health
     */
    function _runHealing(
        States.FullState memory mage,
        uint8 points,
        MaxValues memory maxValues
    ) private pure returns (States.FullState memory) {
        if (mage.health + points >= maxValues.maxHealth) {
            mage.health = maxValues.maxHealth;
        } else {
            mage.health += points;
        }

        return mage;
    }

    /*
     * @dev _runIncreaseShields - increases only the Mage shields
     */
    function _runIncreaseShields(
        States.FullState memory mage,
        uint8 points,
        MaxValues memory maxValues
    ) private pure returns (States.FullState memory) {
        if (mage.shields + points >= maxValues.maxShields) {
            mage.shields = maxValues.maxShields;
        } else {
            mage.shields += points;
        }

        return mage;
    }
}
