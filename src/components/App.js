import React, { Component } from 'react';
import ArtBox from '../abis/ArtBox.json'
import Navbar from './Navbar.js';
import Web3 from 'web3';
import './App.css';
import Main from './Main.js'


class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3(){
      // Modern dapp browsers...
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          const selectedAccount = (await window.ethereum.enable())
          if (!selectedAccount){
            console.log('User opted out')
          }
          else{
            console.log('User gave access')
          }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
          console.log('Legacy dapp browser detected')
      }
      // Non-dapp browsers...
      else {
        window.web3 = new Web3.providers.HttpProvider('http://localhost:7545');
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Getting user account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Load blockchain data
    const networkId = await web3.eth.net.getId()
    const networkData = ArtBox.networks[networkId]
    console.log(networkData)
    if(networkData) {
      const artbox = web3.eth.Contract(ArtBox.abi, networkData.address)
      this.setState({artbox})
      console.log(artbox)
      const artworkCount = await artbox.methods.artworkCount().call()
      console.log('Artwork Count' , artworkCount)
      for (var i = 1; i <= artworkCount; i++){
         const artwork = await artbox.methods.artworks(i).call()
         this.setState({
           artworks: [...this.state.artworks, artwork]

         })
         console.log(this.state.artworks)
       }
      this.setState({ loading: false})
      console.log('BlockchainData loaded')
    } else {
      window.alert('ArtBox contract not deployed to detected network.')
    }


  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      artworkCount: 0,
      artworks: [],
      loading: true
    }
    this.uploadArtwork = this.uploadArtwork.bind(this)
    this.buyArtwork = this.buyArtwork.bind(this)
  }
  
  uploadArtwork(name, price, ipfsHash) {
    this.setState({ loading: true })
    console.log('before transaction')
    this.state.artbox.methods.createArtwork(name, price, ipfsHash).send({ from: this.state.account })
     .once('receipt', (receipt) => {
       this.setState({ loading: false })
     })
    console.log('after transaction: ', ipfsHash)
  }

  buyArtwork(id, price){
    this.setState({ loading: true})
    this.state.artbox.methods.buyArtwork(id).send({from: this.state.account , value: price})
    .once('receipt', (receipt) =>{
      this.setState({loading: false})
    })
  }



  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <Main 
          artworks = {this.state.artworks}
          uploadArtwork={this.uploadArtwork} 
          buyArtwork={this.buyArtwork}
          hello = "hello"/>
      </div>
    );
  }
}

export default App;
