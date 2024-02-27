// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

library Random {
    function _getRandom(string memory name, uint256 limit) internal view returns (uint256 random) {
        random = uint256(keccak256(abi.encodePacked(msg.sender, name, limit, block.timestamp))) % limit;
        random++;

        return random;
    }
}
