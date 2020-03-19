import React, { Component } from 'react';
import ArtBox from '../abis/ArtBox.json'
import Web3 from 'web3';
import './App.css';


import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";


//Links
import Profile from './Profile';
import Gallery from './Gallery';
import Header from '././Header';
import Navbar from'./Navbar';
import Home from './Home';
import Image from './Image';

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
    console.log('Accounts' + accounts)
    this.setState({ account: accounts[0] })
    // Load blockchain data
    const networkId = await web3.eth.net.getId()
    console.log('Network ID' + networkId)
    const networkData = ArtBox.networks[networkId]
    console.log(networkData)
    if(networkData) {
      const artbox = new web3.eth.Contract(ArtBox.abi, networkData.address)
      this.setState({artbox})
      console.log(artbox)
      const artworkCount = await artbox.methods.artworkCount().call()
      const createdCount = await artbox.methods.createdCount(this.state.account).call()
      const ownerCount = await artbox.methods.ownerCount(this.state.account).call()
      console.log('User created: ', createdCount)
      console.log('User owned', ownerCount)
      console.log('Artwork Count' , artworkCount)
      for (var i = 1; i <= artworkCount; i++){
        const artwork = await artbox.methods.artworks(i).call()
        const ownedArtwork = await artbox.methods.ownersCollection(this.state.account, i).call()
        if (ownedArtwork.id != 0) {
          this.setState({
            userOwned: [...this.state.userOwned, ownedArtwork]
          })
        }
        
        this.setState({
          artworks: [...this.state.artworks, artwork]
        })
      }

      for (var i = 1; i <= createdCount; i++){
        const createdArtworkID = await artbox.methods.userCreated(this.state.account, i).call()
        this.setState({
          userCreated: [...this.state.userCreated, createdArtworkID]
        })
      }

      console.log(this.state.userOwned)
      console.log(this.state.userCreated)
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
      userOwned: [],
      userCreated: []
    }
    this.uploadArtwork = this.uploadArtwork.bind(this)
    this.buyArtwork = this.buyArtwork.bind(this)
  }
  
  uploadArtwork(name, price, originalHash, waterMarkedHash) {
    console.log('before transaction')
    this.state.artbox.methods.createArtwork(name, price, originalHash, waterMarkedHash).send({ from: this.state.account })
     .once('receipt', (receipt) => {
       this.setState({ loading: false })
     })
    console.log('waterMarked Hash: ', waterMarkedHash)
    console.log('originalHash: ', originalHash)
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
      <HashRouter>
        <div>
          <Header/>
          <Navbar account={this.state.account}/>

          <Route exact path='/home'> <Home /> </Route>
          <Route path='/gallery'>
            <Gallery 
              account={this.state.account}
              artworks = {this.state.artworks}
              uploadArtwork={this.uploadArtwork} 
              buyArtwork={this.buyArtwork}/>
          </Route>
          <Route exact path='/profile' component={Profile}>
            <Profile
              account={this.state.account}
              artworks = {this.state.artworks}
              userOwned={this.state.userOwned}
              userCreated={this.state.userCreated}
            /> </Route>

        </div>
      </HashRouter>
    );
  }
}

export default App;
