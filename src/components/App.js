import React, { Component } from 'react';
import './App.css';
import Web3 from "web3"
import token_contract from "../abis/main.json"


class App extends Component {

  async componentWillMount() {
    //Cargar de Web3
    await this.loadWeb3()
    //Carga de los datos de la blockchain
    await this.loadBlockchainData()
  }

  //Carga de Web3
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }

    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }

    else {
      window.alert("Non ethereum browser detected")
    }
  }

  //Carga de los datos de la Blockchain
  async loadBlockchainData() {
    const web3 = window.web3
    //Carga de la cuenta
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = "4" //Rinkeby-->4, Ganache-->5777
    console.log("networkId", networkId)
    const networkData = token_contract.networks[networkId]
    console.log("networkData", networkData)

    //Cundo tenemos la red conectada importamos el contrato
    if(networkData) {

      const abi = token_contract.abi
      const address = networkData.address
      console.log("address", address)
      //Instancia el contrato
      const contract = new web3.eth.Contract(abi, address)
      this.setState({contract})
      //Direccion del smart contract
      const smart_contract_direction = await this.state.contract.methods.getContract().call()
      this.setState({smart_contract_direction})
      console.log("Smart contract direction", smart_contract_direction)
      console.log("State", this.state)
    }else {
      window.alert("Smart contract not deployed in the network")
    }

  }

  //Constructor
  constructor(props) {
    super(props)
    this.state = {
      account: "",
      contract: null,
      smart_contract_direction: "",
      owner: "",
      direction: "",
      quantity: 0,
      loading: false,
      errorMessage: "",
      address_balance: "",
    }
  }

   //Function to buy tokens
   send = async(direction, quantity, ethers) => {
    const web3 = window.web3
    try {
      const accounts = await web3.eth.getAccounts()
      await this.state.contract.methods.send_tokens(direction, quantity).send({from: accounts[0], value: ethers})
    } catch(err) {
      this.setState({errorMessage: err.message})
    } finally {
      this.setState({loading: false})
    }
  }

  //Function to see the balance of an user
  user_balance = async(address_balance) => {
    try {
      const direction_balance = await this.state.contract.methods.address_balance(address_balance).call()
      alert(direction_balance)
      this.setState({direction_balance: address_balance})

    } catch(err){
      this.setState({errorMessage: err.message})

    } finally {
      this.setState({loading: false})

    }
  }

  //Function to see the balance of an user
  contract_balance = async() => {
    try {
      const balance = await this.state.contract.methods.contract_balance().call()
      alert(parseFloat(balance))
      

    } catch(err){
      this.setState({errorMessage: err.message})

    } finally {
      this.setState({loading: false})

    }
  }

  //Function to increase the total supply
  increase_totalSupply = async(_numTokens) => {
    const web3 = window.web3
    try {
      const accounts = await web3.eth.getAccounts()
      await this.state.contract.methods.tokenGeneration(_numTokens).send({from: accounts[0]}) 

    } catch(err){
      this.setState({errorMessage: err.message})

    } finally {
      this.setState({loading: false})

    }
  }






  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://frogames.es/rutas-de-aprendizaje"
            target="_blank"
            rel="noopener noreferrer"
          >
            DApp ERC20
          </a>
          <ul className='navbar-nav px-3'>
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className='text-white'><span id='account'>{this.state.smart_contract_direction}</span></small>
            </li>
          </ul>

        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Buy tokens ERC20</h1>
                <form onSubmit = {(event) => {
                  event.preventDefault()
                  const web3 = window.web3
                  const direction = this.direction.value
                  const quantity = this.quantity.value
                  const ethers = web3.utils.toWei(this.quantity.value, "ether")
                  this.send(direction, quantity, ethers)
                }}>
                <input type= "text" 
                        className="form-control mb-1" 
                        placeholder = "Destiny address"
                        ref = {(input) => {this.direction = input}}>
                </input>

                <input type= "text" 
                        className="form-control mb-1" 
                        placeholder = "Tokens quantity (1 Token = 1 Ether)"
                        ref = {(input) => {this.quantity = input}}>
                </input>

                <input
                  type = "submit"
                    className= "btn btn-block btn-sm btn-outline-dark"
                    value= "BUY TOKENS">
                </input>

                </form>
                
                &nbsp;

                <h1> Total Token Balance </h1>

                <form onSubmit = {(event) => {
                  event.preventDefault()
                  const address = this.address_balance.value
                  this.user_balance(address)
                }}>
                
                <input type= "text" 
                        className="form-control mb-1" 
                        placeholder = "User direction"
                        ref = {(input) => {this.address_balance = input}}>
                </input>

                <input
                  type = "submit"
                    className= "btn btn-block btn-sm btn-outline-primary"
                    value= "TOTAL BALANCE">
                </input>

                </form>

                &nbsp;

                <h1> Smart Contract Balance </h1>

                <form onSubmit = {(event) => {
                  event.preventDefault()
                  this.contract_balance()
                }}>
                
                <input
                  type = "submit"
                    className= "btn btn-block btn-sm btn-outline-secondary"
                    value= "SMART CONTRACT BALANCE">
                </input>
                </form>

                &nbsp;

                <h1>Increase Total Supply</h1>
                <form onSubmit = {(event) => {
                  event.preventDefault()
                  const increase = this.increase.value
                  this.increase_totalSupply(increase)
                }}>
                <input type= "text" 
                        className="form-control mb-1" 
                        placeholder = "Quantity to increase"
                        ref = {(input) => {this.increase = input}}>
                </input>

                <input
                  type = "submit"
                    className= "btn btn-block btn-sm btn-outline-success"
                    value= "INCREASE TOKENS">
                </input>
                </form>



                

                
                
      
                
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
