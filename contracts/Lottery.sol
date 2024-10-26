// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    address public manager;
    address[] public players;
    string public lotteryName;
    address public winner;

    constructor(string memory _lotteryName) {
        manager = msg.sender;
        lotteryName = _lotteryName;
    }

    mapping(address => bool) public hasEntered;

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0.");
    }

    function enter() public payable {
        require(!hasEntered[msg.sender], "You have already entered the lottery.");
        require(msg.value > 0, "Entry fee must be greater than 0.");
        players.push(msg.sender);
        hasEntered[msg.sender] = true;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, players.length)));
    }

    function pickWinner() public restricted {
        require(players.length > 0, "There are no players in the lottery.");
        
        uint index = random() % players.length;
        winner = players[index];
        uint contractBalance = address(this).balance;

        payable(winner).transfer(contractBalance);
        
        // Reset players and hasEntered mappings
        for (uint i = 0; i < players.length; i++) {
            hasEntered[players[i]] = false;
        }
        delete players;
    }
    
    function removePlayer(address player) public restricted {
        require(hasEntered[player], "The player is not in the lottery.");
        
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == player) {
                players[i] = players[players.length - 1];
                players.pop();
                hasEntered[player] = false;
                break;
            }
        }
    }
    
    function clearPlayers() public restricted {
        for (uint i = 0; i < players.length; i++) {
            hasEntered[players[i]] = false;
        }
        delete players;
    }

    modifier restricted() {
        require(msg.sender == manager, "Only the manager can call this function.");
        _;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
    
    function setLotteryName(string memory newName) public restricted {
        lotteryName = newName;
    }
    
    function getWinner() public view returns (address) {
        return winner;
    }
    
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }
}