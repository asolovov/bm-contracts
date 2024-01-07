// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Damage} from "../utils/Damage.sol";
import {MageState} from "../utils/MageState.sol";
import {School} from "../utils/School.sol";
import {SpellState} from "../utils/SpellState.sol";

// IStatuses is an Status module management contract. Status is a affecting Mage or Spell state each turn if checks are
// passed. Status can be burned or blocked by other Status and will burn when its life turns count will end. Status
// module is used by Spell and Battle modules. Each Status can be used by several Spells.
interface IStatuses {
    // Type is a Status type enum
    enum Type {
        // Unknown is used for blank Status struct
        UNKNOWN,
        // Before Spell is used to run Status before Spell run stage. Also known as Active Status
        BEFORE_SPELL,
        // Mutate Spell is used to run Status during Spell run stage. Also known as Passive Status
        MUTATE_SPELL,
        // End Turn is used to run Status after Spell run stage TODO: do we need this?
        END_TURN,
        // Death Check is used to run Status during the Death Checks at any stage
        DEATH_CHECK
    }

    // Status is a struct for registered Status model
    struct Status {
        // Internal Status ID. Used by other contracts
        uint256 id;
        // Status Type is used to run Status and the right stage
        Type statusType;
        // Turn is a Status life turns count
        uint8 turns;
        // Name is used by the user and may be used for logging battle
        string name;
        // Actions is status Action IDs for Active Statuses
        uint256[] actions;
        // On Destroy Actions is status Action IDs for the burn status action
        uint256[] onDestroyActions;
        // Mutations is status Mutations IDs for Passive Statuses
        uint256[] mutations;
    }

    /*
     * GetStatuses is used to retrieve all registered statuses. Can be called by anyone.
     * @return Status array
    */
    function getStatuses() external view returns (Status[] memory);

    /*
     * GetStatus is used to retrieve all status by given Status ID. Can be called by anyone. Can return blank Mutation
     * struct if no status is registered for given id
     * @param id - Status ID
     * @return Status struct
    */
    function getStatus(uint256 id) external view returns (Status memory);

    /*
     * AddStatus is used to add new status. Can be called only by contract owner or admin.
     * @param status - Status params to register
    */
    function addStatus(Status memory status) external;

    /*
     * RunStatus is used to run Status by given Status ID for given states. Can be called by anyone. Can be reverted.
     * @param id - Status id
     * @param self - self Mage state
     * @param opponent - opponent Mage state
     * @param spell - Spell state
     * @return mutated self Mage state
     * @return mutated Spell state
    */
    function runStatus(
        uint256 id,
        MageState.FullState memory self,
        MageState.FullState memory opponent,
        SpellState.ShortMageEffect memory spell
    ) external view returns (MageState.FullState memory, SpellState.ShortMageEffect memory);

    /*
     * RunOnDestroy is used to run Status On Destroy Actions. Can be called by anyone. Can be reverted.
     * @param id - Status id
     * @param self - self Mage state
     * @param opponent - opponent Mage state
     * @return mutated self Mage state
    */
    function runOnDestroy(
        uint256 id,
        MageState.FullState memory self,
        MageState.FullState memory opponent
    ) external view returns (MageState.FullState memory);
}
