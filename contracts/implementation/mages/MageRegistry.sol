// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {IMages} from "../../interface/IMages.sol";

import {Race} from "../../utils/Race.sol";
import {School} from "../../utils/School.sol";
import {Random} from "../../utils/Random.sol";

contract MageRegistry is IMages, ERC721 {

    uint256 private _nextID;

    string[] private _names;

    mapping(uint256 => Mage) private _mages;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        _nextID = 1;
    }

    function getNames() external view returns(string[] memory) {
        return _names;
    }

    function isNameAllowed(string calldata name) external view returns(bool) {
        return _isNameAllowed(name);
    }

    function createMage(string calldata name) external {
        require(_isNameAllowed(name), "MageRegistry: name already exist");
        // TODO: add balance of require?

        _names.push(name);
        _safeMint(msg.sender, _nextID);
        _mages[_nextID] = Mage(_nextID, name, _getRace(name), _getSchool(name));
        _nextID++;
    }

    function getMage(uint256 id) external view returns(Mage memory) {
        return _mages[id];
    }

    function _getRace(string memory name) private view returns(Race.Type) {
        return Race.Type(Random._getRandom(name, uint256(type(Race.Type).max)));
    }

    function _getSchool(string memory name) private view returns(School.Type) {
        return School.Type(Random._getRandom(name, uint256(type(School.Type).max)));
    }

    function _isNameAllowed(string calldata name) private view returns(bool) {
        for (uint256 i = 0; i < _names.length; i++) {
            if (keccak256(abi.encode(_names[i])) == keccak256(abi.encode(name))) {
                return false;
            }
        }

        return true;
    }

}
