// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IRace } from "../../interfaces/IRace.sol";
import { IActions } from "../../interfaces/IActions.sol";
import { IState } from "../../interfaces/IState.sol";
import { States } from "../../utils/States.sol";
import { Target } from "../../utils/Target.sol";
import { Effects } from "../../utils/Effects.sol";

contract RaceRegistry is IRace, Ownable {
    uint256 private _nextID;

    address private _actions;

    address private _state;

    mapping(uint256 => Race) private _races;

    constructor(address actions, address state) Ownable(msg.sender) {
        _nextID = 1;
        _actions = actions;
        _state = state;
    }

    function addRace(Race calldata race) external {
        _races[_nextID] = race;
        _races[_nextID].id = _nextID;
        _nextID++;
    }

    function getRace(uint256 id) external view returns (Race memory) {
        return _races[id];
    }

    function getRaces() external view returns (Race[] memory races) {
        races = new Race[](_nextID - 1);
        for (uint256 i = 0; i < _nextID - 1; i++) {
            races[i] = _races[i + 1];
        }
    }

    function applyRaceEffects(
        States.FullState memory self,
        States.FullState memory opponent
    ) external view returns (States.FullState memory, States.FullState memory) {
        Effects.ActionEffect memory effect;
        bool ok;

        for (uint256 i = 0; i < _races[self.race].selfActions.length; i++) {
            (effect, ok) = _runAction(_races[self.race].selfActions[i], Target.Type.SELF, self, opponent);

            if (ok) {
                self = IState(_state).applyActionEffects(effect, self, 1);
            }
        }

        for (uint256 i = 0; i < _races[self.race].opponentActions.length; i++) {
            (effect, ok) = _runAction(_races[self.race].opponentActions[i], Target.Type.OPPONENT, self, opponent);

            if (ok) {
                self = IState(_state).applyActionEffects(effect, self, 1);
            }
        }

        return (self, opponent);
    }

    function _runAction(
        uint256 id,
        Target.Type target,
        States.FullState memory self,
        States.FullState memory opponent
    ) private view returns (Effects.ActionEffect memory, bool) {
        return IActions(_actions).runAction(id, target, self, opponent, 0, false);
    }
}
