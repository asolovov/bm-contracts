// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { School } from "./School.sol";
import { Damage } from "./Damage.sol";
import { Effects } from "./Effects.sol";
import { States } from "./States.sol";

// Checks is a library for running Actions and Mutation checks. Check is used to check Spell or Mage state before
// running Actions or Mutations. If check failed, Action or Mutation will not run. Check are registered with the Action
// or Mutation in the corresponding contracts.
library Checks {
    // ActionCheck is used for the Action checks
    struct ActionCheck {
        ActionChecks checkType;
        // Target for state checks
        uint8 points;
        uint256 statusID;
        // Target for chance check from 1 to 100
        uint8 chance;
    }

    // ActionChecks is an ActionCheck Types
    enum ActionChecks {
        UNKNOWN,
        // State checks
        HEALTH_LESS, // using given state and check points
        HEALTH_MORE, // using given state and check points
        SHIELDS_LESS, // using given state and check points
        SHIELDS_MORE, // using given state and check points
        PASS, // using given state
        STATUS, // using given state and check statusID
        NO_STATUS, // using given state and check statusID
        LUCK // using check chance
    }

    // ActionCheck is used for the Mutation checks
    struct MutationCheck {
        Checks.MutationChecks checkType;
        // Check spell damage
        Damage.Type damageType;
        School.Type damageSchool;
        uint8 points; // Can also be used to check mage state
        // Check spell status
        uint256 statusID;
    }

    // MutationChecks is an MutationCheck Types
    enum MutationChecks {
        UNKNOWN,
        SPELL_SCHOOL, // using given spell state and check damage school
        SPELL_DAMAGE_TYPE, // using given spell state and check damage type
        SPELL_STATUS, // using given spell state and check statusID
        SPELL_DAMAGE_MORE, // using given spell state and check points
        SPELL_DAMAGE_LESS, // using given spell state and check points
        SHIELDS_LESS,
        SHIELDS_MORE,
        HEALTH_LESS,
        HEALTH_MORE
    }

    /*
     * @dev _runMutationCheck is used to run mutation check. Used by the Mutation contract. Can be reverted if
     * Check type is Unknown
     */
    function _runMutationCheck(
        // Received from the game
        States.FullState memory mage,
        Effects.ActionEffect memory spell,
        // Received from the check struct
        MutationCheck memory check
    ) internal pure returns (bool) {
        if (check.checkType == MutationChecks.SPELL_SCHOOL) {
            return spell.damageSchool == check.damageSchool;
        }

        if (check.checkType == MutationChecks.SPELL_DAMAGE_TYPE) {
            return spell.damageType == check.damageType;
        }

        if (check.checkType == MutationChecks.SPELL_STATUS) {
            return spell.addStatus == check.statusID;
        }

        if (check.checkType == MutationChecks.SPELL_DAMAGE_MORE) {
            return spell.points > check.points;
        }

        if (check.checkType == MutationChecks.SPELL_DAMAGE_LESS) {
            return spell.points < check.points;
        }

        if (check.checkType == MutationChecks.SHIELDS_MORE) {
            return mage.shields > check.points;
        }

        if (check.checkType == MutationChecks.SHIELDS_LESS) {
            return mage.shields < check.points;
        }

        if (check.checkType == MutationChecks.HEALTH_MORE) {
            return mage.health > check.points;
        }

        if (check.checkType == MutationChecks.HEALTH_LESS) {
            return mage.health < check.points;
        }

        revert("Check: mutation check cannot be unknown");
    }

    /*
     * @dev _runActionCheck is used to run action check. Used by the Actions contract. Can be reverted if
     * Check type is Unknown
     */
    function _runActionCheck(States.FullState memory mage, ActionCheck memory check) internal view returns (bool) {
        if (check.checkType == ActionChecks.HEALTH_LESS) {
            return mage.health < check.points;
        }

        if (check.checkType == ActionChecks.HEALTH_MORE) {
            return mage.health > check.points;
        }

        if (check.checkType == ActionChecks.SHIELDS_LESS) {
            return mage.shields < check.points;
        }

        if (check.checkType == ActionChecks.SHIELDS_MORE) {
            return mage.shields > check.points;
        }

        if (check.checkType == ActionChecks.PASS) {
            return mage.isPass;
        }

        if (check.checkType == ActionChecks.STATUS) {
            return _checkStatus(mage.statuses, check.statusID);
        }

        if (check.checkType == ActionChecks.NO_STATUS) {
            return _checkNoStatus(mage.statuses, check.statusID);
        }

        if (check.checkType == ActionChecks.LUCK) {
            return _checkLuck(check.chance);
        }

        revert("Check: action check cannot be unknown");
    }

    /*
     * @dev _checkLuck is used to run check luck for given chance. 100 will always be true and 0 will always be false.
     */
    function _checkLuck(uint8 chance) private view returns (bool) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, chance))) % 100;
        random++;

        return chance >= random;
    }

    /*
     * @dev _checkStatus is used to check if given statusID is in the given statuses
     */
    function _checkStatus(uint256[] memory statuses, uint256 statusID) private pure returns (bool) {
        for (uint256 i = 0; i < statuses.length; i++) {
            if (statuses[i] == statusID) {
                return true;
            }
        }

        return false;
    }

    /*
     * @dev _checkStatus is used to check if given statusID is not in the given statuses
     */
    function _checkNoStatus(uint256[] memory statuses, uint256 statusID) private pure returns (bool) {
        for (uint256 i = 0; i < statuses.length; i++) {
            if (statuses[i] == statusID) {
                return false;
            }
        }

        return true;
    }
}
