const { assert } = require("chai")

const Main = artifacts.require("Main")

contract("Main", accounts => {
    it("Function: getOwner()", async() => {
        let instance = await Main.deployed()

        const ownerAddress = await instance.getOwner.call()
        assert.equal(accounts[0], ownerAddress)
    });

    it("Function: sendTokens()", async() => {
        let instance = await Main.deployed()

        let initialBlanace = await instance.contract_balance()
        let initialAddressBalance = await instance.address_balance(accounts[0])

        await instance.send_tokens(accounts[0], 10, {from: accounts[0]})

        let contractBalance = await instance.contract_balance()
        let addressBalance = await instance.address_balance(accounts[0])

        assert.equal(contractBalance, parseInt(initialBlanace -10))
        assert.equal(addressBalance, parseInt(initialAddressBalance +10))
        
    });
})