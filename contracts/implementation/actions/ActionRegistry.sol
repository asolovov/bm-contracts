// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IActions} from "../../interface/IActions.sol";

import {Checks} from "../../utils/Checks.sol";
import {Damage} from "../../utils/Damage.sol";
import {School} from "../../utils/School.sol";
import {MageState} from "../../utils/MageState.sol";
import {Target} from "../../utils/Target.sol";
import {Random} from "../../utils/Random.sol";

// ActionRegistry is an implementation for the IActions interface
contract ActionRegistry is IActions, Ownable {
    // New action ID
    uint256 private _nextID;

    // Actions storage ID => Action struct
    mapping(uint256 => Action) private _actions;

    constructor() Ownable(msg.sender){
        _nextID = 1;
    }

    /*
     * See {IActions - getAllActions}
    */
    function getAllActions() external view returns (Action[] memory actions) {
        for (uint256 i = 0; i < _nextID; i++) {
            actions[i] = _actions[i];
        }

        return actions;
    }

    /*
     * See {IActions - getAction}
    */
    function getAction(uint256 id) external view returns (Action memory) {
        return _actions[id];
    }

    /*
     * See {IActions - addAction}
     * @dev adding Action to _actions storage and increase _nextID var. Can be called only by the contract owner
    */
    function addAction(Action memory action) external onlyOwner {
        Action storage a = _actions[_nextID];

        a.id = _nextID;
        a.description = action.description;
        a.actionType = action.actionType;

        a.points = action.points;
        a.damage = action.damage;
        a.school = action.school;
        a.statusID = action.statusID;
        a.spellID = action.spellID;

        Checks.ActionCheck[] storage self = a.selfChecks;
        for (uint256 i = 0; i < action.selfChecks.length; i++) {
            self.push(action.selfChecks[i]);
        }

        Checks.ActionCheck[] storage opponent = a.opponentChecks;
        for (uint256 i = 0; i < action.opponentChecks.length; i++) {
            opponent.push(action.opponentChecks[i]);
        }

        a.selfChecks = self;
        a.opponentChecks = opponent;

        _nextID++;
    }

    /*
     * See {IActions - runAction}
     * @dev first will run checks for self and opponent states. If all checks are ok will call _runAction method for
     * target state. Can be reverted if given ID is unknown or for given ID Action with Unknown type is registered
    */
    function runAction(
        uint256 id,
        Target.Type target,
        MageState.FullState memory self,
        MageState.FullState memory opponent
    ) external view returns (MageState.FullState memory targetState) {
        if (target == Target.Type.SELF) {
            targetState = self;
        } else {
            targetState = opponent;
        }

        for (uint256 i = 0; i < _actions[id].selfChecks.length; i++) {
            if (!Checks._runActionCheck(self, _actions[id].selfChecks[i])) {
                return targetState;
            }
        }

        for (uint256 i = 0; i < _actions[id].opponentChecks.length; i++) {
            if (!Checks._runActionCheck(opponent, _actions[id].opponentChecks[i])) {
                return targetState;
            }
        }

        return _runAction(id, targetState);
    }

    /*
     * @dev will run Action for given Action ID and state. Can be reverted if given ID is unknown or for given ID Action
     * with Unknown type is registered. Will returned changed state.
    */
    function _runAction(uint256 id, MageState.FullState memory state) private view returns(MageState.FullState memory) {
        if(_actions[id].actionType == Type.DAMAGE) {
            return _runDamage(id, state);
        }

        if(_actions[id].actionType == Type.ADD_STATUS) {
            return _addStatus(state, _actions[id].statusID);
        }

        if(_actions[id].actionType == Type.BURN_STATUS) {
            return _burnStatus(state, _actions[id].statusID);
        }

        if(_actions[id].actionType == Type.CHANGE_STATUS) {
            return _runChangeStatus(id, state);
        }

        if(_actions[id].actionType == Type.BURN_ALL_STATUSES) {
            state.statuses = new uint256[](0);
            return state;
        }

        if(_actions[id].actionType == Type.ADD_SPELL) {
            return _addSpell(id, state);
        }

        if(_actions[id].actionType == Type.BURN_SPELL) {
            return _burnSpell(state);
        }

        if(_actions[id].actionType == Type.SET_SHIELDS) {
            return _setShields(id, state);
        }

        if(_actions[id].actionType == Type.SKIP_TURN) {
            return _skipTurn(state);
        }

        revert("Actions: action type cannot be unknown");
    }

    /*
     * @dev is used to get points value from given points array using pseudorandom index
    */
    function _getPoints(uint8[] memory points, string memory name) private view returns(uint8) {
        uint256 random = Random._getRandom(name, points.length);
        random--;
        return points[random];
    }

    /*
     * @dev is used to run Damage type Actions
    */
    function _runDamage(uint256 id, MageState.FullState memory state) private view returns (MageState.FullState memory) {
        MageState.ShortState memory res = Damage._runDamage(
            MageState.ShortState(state.health, state.shields, state.spells.length),
            _getPoints(_actions[id].points, _actions[id].description),
            _actions[id].damage
        );

        state.shields = res.shields;
        state.health = res.health;

        return state;
    }

    /*
     * @dev is used to run Change Status type Actions
    */
    function _runChangeStatus(uint256 id, MageState.FullState memory state) private view returns (MageState.FullState memory) {
        if (state.statuses.length > 0) {
            state = _burnStatus(state, state.statuses[0]);
            state = _addStatus(state, _actions[id].statusID);
        }

        return state;
    }

    /*
     * @dev is used to run Add Spell type Actions
    */
    function _addSpell(uint256 id, MageState.FullState memory state) private view returns (MageState.FullState memory) {
        uint256[] memory spells = new uint256[](state.spells.length + 1);
        for (uint256 i = 0; i < state.spells.length; i++) {
            spells[i] = state.spells[i];
        }
        spells[state.spells.length] = _actions[id].spellID;
        state.spells = spells;

        return state;
    }

    /*
     * @dev is used to run Burn Spell type Actions
    */
    function _burnSpell(MageState.FullState memory state) private pure returns (MageState.FullState memory) {
        if (state.spells.length > 0) {
            state.spells[state.spells.length - 1] = 0;
        }

        return state;
    }

    /*
     * @dev is used to run Set Shields type Actions
    */
    function _setShields(uint256 id, MageState.FullState memory state) private view returns (MageState.FullState memory) {
        state.shields = _getPoints(_actions[id].points, _actions[id].description);

        return state;
    }

    /*
     * @dev is used to run Skip Turn type Actions
    */
    function _skipTurn(MageState.FullState memory state) private pure returns (MageState.FullState memory) {
        state.isPass = true;

        return state;
    }

    /*
     * @dev is used to run Burn Status type Actions
    */
    function _burnStatus(MageState.FullState memory state, uint256 statusID) private pure returns (MageState.FullState memory) {
        if (_isStatusInState(state, statusID)) {
            uint256[] memory stats = new uint256[](state.statuses.length - 1);

            for (uint256 i = 0; i < state.statuses.length; i++) {
                if (state.statuses[i] != statusID) {
                    stats[i] = state.statuses[i];
                }
            }

            state.statuses = stats;
        }

        return state;
    }

    /*
     * @dev is used to run Add Status type Actions
    */
    function _addStatus(MageState.FullState memory state, uint256 statusID) private pure returns (MageState.FullState memory) {
        uint256[] memory stats = new uint256[](state.statuses.length + 1);
        for (uint256 i = 0; i < state.statuses.length; i++) {
            stats[i] = state.statuses[i];
        }
        stats[state.statuses.length] = statusID;
        state.statuses = stats;

        return state;
    }

    /*
     * @dev is used to check if given Status ID is in given state
    */
    function _isStatusInState(MageState.FullState memory state, uint256 statusID) private pure returns (bool) {
        for (uint256 i = 0; i < state.statuses.length; i++) {
            if (state.statuses[i] == statusID) {
                return true;
            }
        }

        return false;
    }
}
