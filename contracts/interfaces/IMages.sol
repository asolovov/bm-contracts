// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { School } from "../utils/School.sol";
import { States } from "../utils/States.sol";

interface IMages is IERC721 {
    function getNames() external view returns (string[] memory);

    function isNameAllowed(string calldata name) external view returns (bool);

    function createMage(string calldata name) external;

    function getMage(uint256 id) external view returns (States.Mage memory);
}
