// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IStatuses } from "../../interfaces/IStatuses.sol";
import { IState } from "../../interfaces/IState.sol";
import { IActions } from "../../interfaces/IActions.sol";
import { IMutations } from "../../interfaces/IMutations.sol";

import { States } from "../../utils/States.sol";
import { School } from "../../utils/School.sol";
import { Damage } from "../../utils/Damage.sol";
import { Target } from "../../utils/Target.sol";
import { Effects } from "../../utils/Effects.sol";

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

    address private _state;

    constructor(address actions, address mutations, address state) Ownable(msg.sender) {
        _nextID = 1;
        _actions = actions;
        _mutations = mutations;
        _state = state;
    }

    /*
     * See {IStatuses - getStatuses}
     */
    function getStatuses() external view returns (Status[] memory statuses) {
        statuses = new Status[](_nextID - 1);

        for (uint256 i = 0; i < _nextID - 1; i++) {
            statuses[i] = _statuses[i + 1];
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
    function addStatus(Status calldata status) external onlyOwner {
        _statuses[_nextID] = status;
        _statuses[_nextID].id = _nextID;
        _nextID++;
    }

    function runActiveStatuses(
        States.FullState memory self,
        States.FullState calldata opponent,
        uint8 turn
    ) external view returns (States.FullState memory) {
        Effects.ActionEffect memory effect;
        bool ok;
        for (uint256 s = 0; s < self.statuses.length; s++) {
            if (_statuses[self.statuses[s]].statusType == Type.BEFORE_SPELL) {
                for (uint256 a = 0; a < _statuses[self.statuses[s]].actions.length; a++) {
                    (effect, ok) = IActions(_actions).runAction(
                        _statuses[self.statuses[s]].actions[a],
                        Target.Type.SELF,
                        self,
                        opponent,
                        self.statuses[s],
                        false
                    );

                    if (ok) {
                        self = IState(_state).applyActionEffects(effect, self, turn);
                    }

                    if (self.statuses.length == 0) {
                        break;
                    }
                }
            }
        }

        return self;
    }

    function runPassiveStatuses(
        States.FullState calldata self,
        Effects.ActionEffect memory spellEffect
    ) external view returns (Effects.ActionEffect memory) {
        for (uint256 s = 0; s < self.statuses.length; s++) {
            if (_statuses[self.statuses[s]].statusType == Type.MUTATE_SPELL) {
                for (uint256 m = 0; m < _statuses[self.statuses[s]].mutations.length; m++) {
                    spellEffect = IMutations(_mutations).runMutation(
                        _statuses[self.statuses[s]].mutations[m],
                        spellEffect,
                        self
                    );
                }
            }
        }

        return spellEffect;
    }

    function runDeathCheckStatuses(
        States.FullState memory self,
        uint8 turn
    ) external view returns (States.FullState memory, bool ok) {
        Effects.ActionEffect memory effect;
        uint256 statusID;

        for (uint256 s = 0; s < self.statuses.length; s++) {
            if (_statuses[self.statuses[s]].statusType == Type.DEATH_CHECK) {
                for (uint256 a = 0; a < _statuses[self.statuses[s]].onDestroyActions.length; a++) {
                    (effect, ok) = IActions(_actions).runAction(
                        _statuses[self.statuses[s]].onDestroyActions[a],
                        Target.Type.SELF,
                        self,
                        self,
                        self.statuses[s],
                        false
                    );

                    if (ok) {
                        self = IState(_state).applyActionEffects(effect, self, turn); // Deep-seated fears should be applied on opponent
                    }
                }

                statusID = self.statuses[s];
                break;
            }
        }

        if (statusID > 0) {
            self = _deleteStatus(self, statusID);

            return (self, true);
        } else {
            return (self, false);
        }
    }

    function decreaseStatusTurns(
        States.FullState memory self,
        uint8 turn
    ) external view returns (States.FullState memory) {
        uint256[] memory toDel = new uint256[](self.statuses.length);
        Effects.ActionEffect memory effect;
        bool ok;

        for (uint256 t = 0; t < self.turns.length; t++) {
            if (self.turns[t] + _statuses[self.statuses[t]].turns == turn) {
                toDel[t] = self.statuses[t];

                for (uint256 a = 0; a < _statuses[self.statuses[t]].onDestroyActions.length; a++) {
                    (effect, ok) = IActions(_actions).runAction(
                        _statuses[self.statuses[t]].onDestroyActions[a],
                        Target.Type.SELF,
                        self,
                        self,
                        self.statuses[t],
                        false
                    );

                    if (ok) {
                        self = IState(_state).applyActionEffects(effect, self, turn);
                    }
                }
            }
        }

        for (uint256 i = 0; i < toDel.length; i++) {
            if (toDel[i] > 0) {
                self = _deleteStatus(self, toDel[i]);
            }
        }

        return self;
    }

    function _deleteStatus(
        States.FullState memory state,
        uint256 statusID
    ) private pure returns (States.FullState memory) {
        uint256[] memory statuses = new uint256[](state.statuses.length - 1);
        uint8[] memory turns = new uint8[](state.turns.length - 1);

        uint256 l;
        for (uint256 i = 0; i < state.statuses.length; i++) {
            if (state.statuses[i] != statusID) {
                statuses[l] = state.statuses[i];
                turns[l] = state.turns[i];
                l++;
            }
        }

        state.statuses = statuses;
        state.turns = turns;

        return state;
    }
}
