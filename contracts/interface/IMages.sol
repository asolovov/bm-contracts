// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Race} from "../utils/Race.sol";
import {School} from "../utils/School.sol";

interface IMages is IERC721 {

    struct Mage {
        uint256 id;
        string name;
        Race.Type race;
        School.Type school;
    }

    function getNames() external view returns(string[] memory);

    function isNameAllowed(string calldata name) external view returns(bool);

    function createMage(string calldata name) external;

    function getMage(uint256 id) external view returns(Mage memory);
}
