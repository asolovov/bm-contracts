// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Checks } from "../utils/Checks.sol";
import { Damage } from "../utils/Damage.sol";
import { School } from "../utils/School.sol";
import { Effects } from "../utils/Effects.sol";
import { States } from "../utils/States.sol";

// IMutations is an Mutations module management contract. Mutations module is used by Spell module. Running the
// Passive Status means to run all its mutations. Mutation can be used by several Statuses. Mutation mutates
// given Spell state. Other contracts know only the ID of the Mutation to run, all other data is stored and
// managed in this module.
interface IMutations {
    // Type is an Mutation type enum
    enum Type {
        // Unknown is used for blank Mutation struct
        UNKNOWN,
        // Increase Damage is used to increase Spell damage
        INCREASE_DAMAGE,
        // Decrease Damage is used to decrease Spell damage
        DECREASE_DAMAGE,
        // Change Damage Type is used to change Spell damage type
        CHANGE_DAMAGE_TYPE,
        // Set Damage Type is used to set new Spell damage points
        SET_DAMAGE,
        // Set Damage To HP is used to set damage depends on the shields value and Spell damage type
        SET_DAMAGE_TO_HP,
        // Block Shield Damage is used to decrease classic damage if Mage shields are more than 0
        BLOCK_SHIELD_DAMAGE,
        // Block Status Damage is used to block specific Spell status
        BLOCK_STATUS,
        // Block Status Damage is used to block all Spell statuses
        BLOCK_ALL_STATUSES
    }

    // Mutation is a struct for registered Mutation model
    struct Mutation {
        // Internal Mutation ID. Used by other contracts
        uint256 id;
        // Description is used by the user and may be used for logging battle\
        string description;
        // Mutation Type is used to run Mutation properly
        Type mutationType;
        // Checks are used to check the Spell and Mage states
        Checks.MutationCheck[] spellChecks;
        // Damage Type is used for the Change Damage Type Mutation
        Damage.Type mutateDamage;
        // Points are used to Decrease or Increase Spell damage points
        uint8 points;
        // Status ID is used to block Spell status
        uint256 statusID;
    }

    /*
     * GetAllMutations is used to retrieve all registered mutations. Can be called by anyone.
     * @return Mutation array
     */
    function getAllMutations() external view returns (Mutation[] memory);

    /*
     * GetMutation is used to retrieve mutation for given id. Can be called by anyone. Can return blank Mutation struct
     * if no action is registered for given id
     * @param id - Mutation ID
     * @return Mutation struct
     */
    function getMutation(uint256 id) external view returns (Mutation memory);

    /*
     * AddMutation is used to add new mutation. Can be called only by contract owner or admin.
     * @param mutation - Mutation params to register
     */
    function addMutation(Mutation memory mutation) external;

    /*
     * RunMutation is used to run Mutation by given Mutation ID for given states. Can be called by anyone. Can be reverted.
     * @param id - Mutation id
     * @param spellState - Spell state
     * @param mageState - Mage state
     * @return mutated Spell state
     */
    function runMutation(
        uint256 id,
        Effects.ActionEffect memory spellState,
        States.FullState calldata mageState
    ) external view returns (Effects.ActionEffect memory);
}
