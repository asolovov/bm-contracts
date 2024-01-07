// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {MageState} from "./MageState.sol";

// Damage is a library for running damage Actions. Library is implementing Damage effects on the Mage state.
library Damage {

    // TODO: do we need it here or else?
    uint8 constant public maxHealth = 12;
    uint8 constant public maxShields = 12;

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
    function _runDamage(MageState.ShortState memory mage, uint8 points, Damage.Type damage) internal pure returns (MageState.ShortState memory) {
        if (damage == Type.CLASSIC) {
            return _runClassic(mage, points);
        } else if (damage == Type.PIERCING) {
            return _runPiercing(mage, points);
        } else if (damage == Type.SHIELD_BRAKING) {
            return _runShieldBraking(mage, points);
        } else if (damage == Type.HEALING) {
            return _runHealing(mage, points);
        } else if (damage == Type.INCREASE_SHIELDS) {
            return _runIncreaseShields(mage, points);
        }

        revert("Damage: damage cannot be unknown");
    }

    /*
     * @dev _runClassic - classic damage first reduces the Mage shields and than reduces Mage health
    */
    function _runClassic(MageState.ShortState memory mage, uint8 points) private pure returns (MageState.ShortState memory) {
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
    function _runPiercing(MageState.ShortState memory mage, uint8 points) private pure returns (MageState.ShortState memory) {
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
    function _runShieldBraking(MageState.ShortState memory mage, uint8 points) private pure returns (MageState.ShortState memory) {
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
    function _runHealing(MageState.ShortState memory mage, uint8 points) private pure returns (MageState.ShortState memory) {
        if (mage.health + points >= maxHealth) {
            mage.health = maxHealth;
        } else {
            mage.health += points;
        }

        return mage;
    }

    /*
     * @dev _runIncreaseShields - increases only the Mage shields
    */
    function _runIncreaseShields(MageState.ShortState memory mage, uint8 points) private pure returns (MageState.ShortState memory) {
        if (mage.shields + points >= maxShields) {
            mage.shields = maxShields;
        } else {
            mage.shields += points;
        }

        return mage;
    }

}
