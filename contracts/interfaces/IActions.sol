// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Checks } from "../utils/Checks.sol";
import { Damage } from "../utils/Damage.sol";
import { Target } from "../utils/Target.sol";
import { School } from "../utils/School.sol";
import { States } from "../utils/States.sol";
import { Effects } from "../utils/Effects.sol";

// IActions is an Actions module management contract. Actions module is used by Spell and Status modules. Running the
// Spell or Status means to run all its actions. Action can be used by several Spells or Statuses. Action mutates
// given Mage state. Other contracts know only the ID of the Action to run, all other data is stored and
// managed in this module.
interface IActions {
    // Type is an Action type enum
    enum Type {
        // Unknown is used for blank Action struct
        UNKNOWN,
        // Damage is changing Health and Shields params
        DAMAGE,
        // Add Status is adding status ID
        ADD_STATUS,
        // Burn Status is burning given Status ID
        BURN_STATUS,
        // Change Status is changing random Status to given Status ID
        CHANGE_STATUS,
        // Burn all Statuses is burning all status IDs
        BURN_ALL_STATUSES,
        // Add Spell is adding given Spell ID
        ADD_SPELL,
        // Burn Spell is burning random spell
        BURN_SPELL,
        // Set Shields is setting given points to Shields param
        SET_SHIELDS,
        // Skip Turn is setting true to the Skip Turn param
        SKIP_TURN
    }

    // Action is a struct for registered Action model
    struct Action {
        // Internal Action ID. Used by other contracts
        uint256 id;
        // Description is used by the user and may be used for logging battle
        string description;
        // Action Type is used to run Action properly
        Type actionType;
        // Self Checks are used to check the target Mage state
        Checks.ActionCheck[] selfChecks;
        // Opponent Checks are used to check the opponent Mage state
        Checks.ActionCheck[] opponentChecks;
        // Points are used for the Damage or Set Shields actions. One of the points in the points array will be used
        // with equal chance
        uint8[] points;
        // Damage Type is used to run the Damage Actions
        Damage.Type damage;
        // School Type is used to run Damage Actions. Can be unknown for active status actions
        School.Type school;
        // Status ID is used for the Change Status action
        uint256 statusID;
        // Spell ID is used for the Add Spell action
        uint256 spellID;
    }

    /*
     * GetAllActions is used to retrieve all registered actions. Can be called by anyone.
     * @return Action array
     */
    function getAllActions() external view returns (Action[] memory);

    /*
     * GetAction is used to retrieve action for given id. Can be called by anyone. Can return blank Action struct
     * if no action is registered for given id
     * @param id - Action ID
     * @return Action struct
     */
    function getAction(uint256 id) external view returns (Action memory);

    /*
     * AddAction is used to add new action. Can be called only by contract owner or admin.
     * @param action - Action params to register
     */
    function addAction(Action memory action) external;

    /*
     * RunAction is used to run Action by given Action ID for given states. Can be called by anyone. Can be reverted.
     * @param id - Action id
     * @param target - action target (self or opponent)
     * @param self - self Mage state
     * @param opponent - opponent Mage state
     * @return target Mage state after action effects
     */
    function runAction(
        uint256 id,
        Target.Type target,
        States.FullState calldata self,
        States.FullState calldata opponent,
        uint256 thisStatusID,
        bool schoolBoost
    ) external view returns (Effects.ActionEffect memory effect, bool ok);
}
