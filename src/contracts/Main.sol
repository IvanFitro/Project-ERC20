// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;
import "./ERC20.sol";

contract main {

    ERC20Basic private token;

    address owner;

    address Contract;

    constructor() public {
        token = new ERC20Basic(10000);
        owner = msg.sender;
        Contract = address(this);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You don't have permissions");
        _;
    }

    function tokenPrice(uint _numTokens) internal pure returns(uint) {
        //1token/1ether
        return _numTokens*(1 ether);
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function getContract() public view returns(address) {
        return Contract;
    }

    function send_tokens(address _reciever, uint _numTokens) public payable {
        uint cost = tokenPrice(_numTokens);
        require(msg.value >= cost, "You don't have enough founds");
        uint returnValue = msg.value - cost;
        msg.sender.transfer(returnValue);
        uint Balance = contract_balance();
        require(_numTokens <= Balance, "Buy less tokens");
        token.transfer(_reciever, _numTokens);
    }

    function address_balance(address _address) public view returns(uint) {
        return token.balanceOf(_address);
    }

    function contract_balance() public view returns(uint) {
        return token.balanceOf(Contract);
    }

    function tokenGeneration(uint _numTokens) public onlyOwner {
        token.increaseTotalSupply(_numTokens);
    }
}