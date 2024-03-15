// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { ISpells } from "../../interfaces/ISpells.sol";
import { IActions } from "../../interfaces/IActions.sol";
import { IStatuses } from "../../interfaces/IStatuses.sol";
import { IState } from "../../interfaces/IState.sol";

import { School } from "../../utils/School.sol";
import { Target } from "../../utils/Target.sol";
import { States } from "../../utils/States.sol";
import { Effects } from "../../utils/Effects.sol";
import "hardhat/console.sol";

contract SpellsRegistry is ISpells, Ownable {
    uint256 private _nextID;

    address private _actions;
    address private _statuses;
    address private _state;

    mapping(uint256 => Spell) private _spells;

    constructor(address actions, address statuses, address state) Ownable(msg.sender) {
        _nextID = 1;
        _actions = actions;
        _statuses = statuses;
        _state = state;
    }

    function getSpells() external view returns (Spell[] memory spells) {
        spells = new Spell[](_nextID - 1);

        for (uint256 i = 0; i < _nextID - 1; i++) {
            spells[i] = _spells[i + 1];
        }

        return spells;
    }

    function getSpell(uint256 id) external view returns (Spell memory) {
        return _spells[id];
    }

    function getSchoolSpells(School.Type school) external view returns (Spell[] memory spells) {
        uint256 j;
        uint256[] memory temp = new uint256[](_nextID);
        for (uint256 i = 1; i < _nextID; i++) {
            if (_spells[i].school == school) {
                temp[j] = i;
                j++;
            }
        }

        spells = new Spell[](j);

        for (uint256 i = 0; i < j; i++) {
            spells[i] = _spells[temp[i]];
        }

        return spells;
    }

    function addSpell(Spell calldata spell) external onlyOwner {
        _spells[_nextID] = spell;
        _spells[_nextID].id = _nextID;
        _nextID++;
    }

    function runNextSpellSelf(
        States.FullState memory self,
        States.FullState calldata opponent,
        uint8 turn
    ) external view returns (States.FullState memory) {
        if (self.spells.length == 0) {
            return self;
        }

        for (uint256 i = 0; i < _spells[self.spells[0]].selfActions.length; i++) {
            Effects.ActionEffect memory effect;
            bool ok;

            (effect, ok) = _runAction(_spells[self.spells[0]].selfActions[i], Target.Type.SELF, self, opponent);

            if (ok) {
                effect = IStatuses(_statuses).runPassiveStatuses(self, effect);

                self = IState(_state).applyActionEffects(effect, self, turn);
            }
        }

        return self;
    }

    function runNextSpellOpponent(
        States.FullState memory self,
        States.FullState memory opponent,
        uint8 turn
    ) external view returns (States.FullState memory, States.FullState memory) {
        if (self.spells.length == 0) {
            return (opponent, self);
        }

        for (uint256 i = 0; i < _spells[self.spells[0]].opponentActions.length; i++) {
            Effects.ActionEffect memory effect;
            bool ok;

            (effect, ok) = _runAction(_spells[self.spells[0]].opponentActions[i], Target.Type.OPPONENT, self, opponent);

            if (ok) {
                effect = IStatuses(_statuses).runPassiveStatuses(opponent, effect);

                opponent = IState(_state).applyActionEffects(effect, opponent, turn);
            }
        }

        self.spells = _burnSpell(self.spells);

        return (opponent, self);
    }

    function _runAction(
        uint256 id,
        Target.Type target,
        States.FullState memory self,
        States.FullState memory opponent
    ) private view returns (Effects.ActionEffect memory, bool) {
        return
            IActions(_actions).runAction(id, target, self, opponent, 0, self.school == _spells[self.spells[0]].school);
    }

    function _burnSpell(uint256[] memory spells) private pure returns (uint256[] memory) {
        uint256[] memory newSpells = new uint256[](spells.length - 1);

        for (uint256 i = 1; i < spells.length; i++) {
            newSpells[i - 1] = spells[i];
        }

        return newSpells;
    }
}
