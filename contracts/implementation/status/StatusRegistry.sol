// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IStatuses} from "../../interface/IStatuses.sol";
import {IActions} from "../../interface/IActions.sol";
import {IMutations} from "../../interface/IMutations.sol";

import {MageState} from "../../utils/MageState.sol";
import {School} from "../../utils/School.sol";
import {Damage} from "../../utils/Damage.sol";
import {Target} from "../../utils/Target.sol";
import {SpellState} from "../../utils/SpellState.sol";

// StatusRegistry is an implementation for the IStatuses interface
contract StatusRegistry is IStatuses, Ownable {
    // New status ID
    uint256 private _nextID;

    // Statuses storage ID => Status struct
    mapping(uint256 => Status) private _statuses;

    // Deployed Actions contract
    address private _actions;

    // Deployed Mutations contract
    address private _mutations;

    constructor(address actions, address mutations) Ownable(msg.sender){
        _nextID = 1;
        _actions = actions;
        _mutations = mutations;
    }

    /*
     * See {IStatuses - getStatuses}
    */
    function getStatuses() external view returns (Status[] memory statuses) {
        for (uint256 i = 0; i < _nextID; i++) {
            statuses[i] = _statuses[i];
        }

        return statuses;
    }

    /*
     * See {IStatuses - getStatus}
    */
    function getStatus(uint256 id) external view returns (Status memory) {
        return _statuses[id];
    }

    /*
     * See {IStatuses - addStatus}
    */
    function addStatus(Status memory status) external onlyOwner {
        status.id = _nextID;
        _statuses[_nextID] = status;
        _nextID++;
    }

    /*
     * See {IStatuses - runStatus}
     * @dev Runs any stage Status TODO: change stage run options
    */
    function runStatus(
        uint256 id,
        MageState.FullState memory self,
        MageState.FullState memory opponent,
        SpellState.ShortMageEffect memory spell
    ) external view returns (MageState.FullState memory, SpellState.ShortMageEffect memory) {
        if (_statuses[id].statusType == Type.MUTATE_SPELL) {
            for (uint256 i = 0; i < _statuses[id].mutations.length; i++) {
                spell = IMutations(_mutations).runMutation(_statuses[id].mutations[i], spell, self);
            }
        }

        if (_statuses[id].statusType == Type.BEFORE_SPELL || _statuses[id].statusType == Type.END_TURN || _statuses[id].statusType == Type.DEATH_CHECK) {
            for (uint256 i = 0; i < _statuses[id].actions.length; i++) {
                self = IActions(_actions).runAction(_statuses[id].actions[i], Target.Type.SELF, self, opponent);
            }
        }

        return (self, spell);
    }

    /*
     * See {IStatuses - runOnDestroy}
    */
    function runOnDestroy(
        uint256 id,
        MageState.FullState memory self,
        MageState.FullState memory opponent
    ) external view returns (MageState.FullState memory) {
        for (uint256 i = 0; i < _statuses[id].onDestroyActions.length; i++) {
            self = IActions(_actions).runAction(_statuses[id].onDestroyActions[i], Target.Type.SELF, self, opponent);
        }

        return self;
    }
}
