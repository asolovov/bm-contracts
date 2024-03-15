// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IActions } from "../../interfaces/IActions.sol";

import { Checks } from "../../utils/Checks.sol";
import { Damage } from "../../utils/Damage.sol";
import { School } from "../../utils/School.sol";
import { Target } from "../../utils/Target.sol";
import { Random } from "../../utils/Random.sol";
import { States } from "../../utils/States.sol";
import { Effects } from "../../utils/Effects.sol";
import "hardhat/console.sol";

// ActionRegistry is an implementation for the IActions interface
contract ActionRegistry is IActions, Ownable {
    // New action ID
    uint256 private _nextID;

    // Actions storage ID => Action struct
    mapping(uint256 => Action) private _actions;

    constructor() Ownable(msg.sender) {
        _nextID = 1;
    }

    /*
     * See {IActions - getActions}
     */
    function getActions() external view returns (Action[] memory actions) {
        actions = new Action[](_nextID - 1);

        for (uint256 i = 0; i < _nextID - 1; i++) {
            actions[i] = _actions[i + 1];
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
    function addAction(Action calldata action) external onlyOwner {
        _actions[_nextID] = action;
        _actions[_nextID].id = _nextID;
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
        States.FullState calldata self,
        States.FullState calldata opponent,
        uint256 thisStatusID,
        bool schoolBoost
    ) external view returns (Effects.ActionEffect memory effect, bool ok) {
        States.FullState memory targetState;
        if (target == Target.Type.SELF) {
            targetState = self;
        } else {
            targetState = opponent;
        }

        for (uint256 i = 0; i < _actions[id].selfChecks.length; i++) {
            if (!Checks._runActionCheck(self, _actions[id].selfChecks[i])) {
                return (effect, false);
            }
        }

        for (uint256 i = 0; i < _actions[id].opponentChecks.length; i++) {
            if (!Checks._runActionCheck(opponent, _actions[id].opponentChecks[i])) {
                return (effect, false);
            }
        }

        return _runAction(_actions[id], targetState, thisStatusID, schoolBoost);
    }

    /*
     * @dev will run Action for given Action ID and state. Can be reverted if given ID is unknown or for given ID Action
     * with Unknown type is registered. Will returned changed state.
     */
    function _runAction(
        Action memory action,
        States.FullState memory state,
        uint256 thisStatusID,
        bool schoolBoost
    ) private view returns (Effects.ActionEffect memory effect, bool ok) {
        ok = true;

        if (action.actionType == Type.DAMAGE) {
            (effect, ok) = _runDamage(action);
            if (ok && schoolBoost) {
                effect.points++;
            }
            return (effect, ok);
        }

        if (action.actionType == Type.ADD_STATUS) {
            return _addStatus(action);
        }

        if (action.actionType == Type.BURN_STATUS) {
            return _burnStatus(action, state);
        }

        if (action.actionType == Type.CHANGE_STATUS) {
            return _runChangeStatus(action, state);
        }

        if (action.actionType == Type.BURN_ALL_STATUSES) {
            effect.burnAllStatuses = _burnAllStatuses(state.statuses, thisStatusID);
            return (effect, ok);
        }

        if (action.actionType == Type.ADD_SPELL) {
            return _addSpell(action);
        }

        if (action.actionType == Type.BURN_SPELL) {
            return _burnSpell(action, state);
        }

        if (action.actionType == Type.SET_SHIELDS) {
            return _setShields(action);
        }

        if (action.actionType == Type.SKIP_TURN) {
            return _skipTurn();
        }

        revert("Actions: action type cannot be unknown");
    }

    function _burnAllStatuses(uint256[] memory statuses, uint256 except) private pure returns (uint256[] memory) {
        uint256[] memory returnStatuses = new uint256[](statuses.length - 1);

        uint256 j;
        for (uint256 i = 0; i < statuses.length; i++) {
            if (statuses[i] != except) {
                returnStatuses[j] = statuses[i];
                j++;
            }
        }

        return returnStatuses;
    }

    /*
     * @dev is used to get points value from given points array using pseudorandom index
     */
    function _getPoints(uint8[] memory points, string memory name) private view returns (uint8) {
        uint256 random = Random._getRandom(name, points.length);
        random--;
        return points[random];
    }

    /*
     * @dev is used to run Damage type Actions
     */
    function _runDamage(Action memory action) private view returns (Effects.ActionEffect memory effect, bool ok) {
        effect.points = _getPoints(action.points, action.description);
        effect.damageSchool = action.school;
        effect.damageType = action.damage;

        return (effect, true);
    }

    /*
     * @dev is used to run Change Status type Actions
     */
    function _runChangeStatus(
        Action memory action,
        States.FullState memory state
    ) private view returns (Effects.ActionEffect memory effect, bool ok) {
        if (state.statuses.length > 0) {
            effect.addStatus = action.statusID;
            effect.changeStatus = true;
            effect.burnStatus = state.statuses[Random._getRandom(action.description, state.statuses.length) - 1];
            ok = true;
        }

        return (effect, ok);
    }

    /*
     * @dev is used to run Add Spell type Actions
     */
    function _addSpell(Action memory action) private pure returns (Effects.ActionEffect memory effect, bool ok) {
        effect.addSpell = action.spellID;

        return (effect, true);
    }

    /*
     * @dev is used to run Burn Spell type Actions
     */
    function _burnSpell(
        Action memory action,
        States.FullState memory state
    ) private view returns (Effects.ActionEffect memory effect, bool ok) {
        if (state.spells.length > 0) {
            effect.burnSpell = state.spells[Random._getRandom(action.description, state.spells.length) - 1];
            ok = true;
        }

        return (effect, ok);
    }

    /*
     * @dev is used to run Set Shields type Actions
     */
    function _setShields(Action memory action) private view returns (Effects.ActionEffect memory effect, bool ok) {
        effect.points = _getPoints(action.points, action.description);
        effect.setShields = true;

        return (effect, true);
    }

    /*
     * @dev is used to run Skip Turn type Actions
     */
    function _skipTurn() private pure returns (Effects.ActionEffect memory effect, bool ok) {
        effect.skip = true;

        return (effect, true);
    }

    /*
     * @dev is used to run Burn Status type Actions
     */
    function _burnStatus(
        Action memory action,
        States.FullState memory state
    ) private pure returns (Effects.ActionEffect memory effect, bool ok) {
        if (_isStatusInState(state, action.statusID)) {
            effect.burnStatus = action.statusID;
            ok = true;
        }

        return (effect, ok);
    }

    /*
     * @dev is used to run Add Status type Actions
     */
    function _addStatus(Action memory action) private pure returns (Effects.ActionEffect memory effect, bool ok) {
        effect.addStatus = action.statusID;

        return (effect, true);
    }

    /*
     * @dev is used to check if given Status ID is in given state
     */
    function _isStatusInState(States.FullState memory state, uint256 statusID) private pure returns (bool) {
        for (uint256 i = 0; i < state.statuses.length; i++) {
            if (state.statuses[i] == statusID) {
                return true;
            }
        }

        return false;
    }
}
