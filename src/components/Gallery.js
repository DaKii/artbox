import React, { Component } from 'react';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import "./gallery.css"

//Links
import Upload from "./Upload"
import Image from './Image'


//Setting up ipfs and filesaver
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: '5001',  protocol: 'https' } );
const FileSaver = require('file-saver');



class Gallery extends Component {


  //Getting IPFS hash then download the file
  getIpfs(hash) {
    const fileHash = hash
    console.log(fileHash)
    ipfs.get(fileHash, function (err, files) {
      if(err){
        console.log("Error when getting file from infura node")
      }
      const array = files.forEach((file) => {
        console.log(file.content)
        //saving file locally to the user
        const blob = new Blob( [ file.content ], { type: 'image/jpeg' } );
        FileSaver.saveAs(blob,'filename');
      })

    })
  //console.log(files.toString())
  }

  async handleChange(e){
    const name = e.target.name
    const value = e.target.value
    if (e.target.id === "buy"){
      console.log(e.target.name)
      await this.props.buyArtwork(name, value)
    } 
    else if (e.target.id === 'download') {
      const hash = e.target.dataset.hash
      this.getIpfs(hash)
      console.log("Error when buying a file on blockchain")
    }

  }



  render() {
    return (
    <HashRouter>
      <Route exact path='/gallery/upload'>
        <Upload uploadArtwork={this.props.uploadArtwork} />
      </Route>

      <Route exact path='/gallery/image/' component={Image}>
      </Route>
      <Route exact path='/gallery'>
        <div class="content">
        <NavLink to="/gallery/upload">Upload</NavLink>
        
          <h2>Buy artwork</h2>

          <div class="container-fluid">
            <div class="row ">
              <div class="col col-sm one">
                <div class="box">
                  <div>Placeholder 1</div>
                  <a href="https://placeholder.com"><img src="https://via.placeholder.com/150" /></a>
                  <div>Price : 1 Eth</div>
                  <div>Owner : 20324234</div>
                  <div>Artist : 2321354</div>
                </div>
              </div>
              <div class="col col-sm one">
                <div class="box">
                  <div>Placeholder 1</div>
                  <a href="https://placeholder.com"><img src="https://via.placeholder.com/150" /></a>
                  <div>Price : 1 Eth</div>
                  <div>Owner : 20324234</div>
                  <div>Artist : 2321354</div>
                </div>
              </div>
              <div class="col col-sm one">
                <div class="box">
                  <div>Placeholder 1</div>
                  <a href="https://placeholder.com"><img src="https://via.placeholder.com/150" /></a>
                  <div>Price : 1 Eth</div>
                  <div>Owner : 20324234</div>
                  <div>Artist : 2321354</div>
                </div>
              </div>
              { this.props.artworks.map((artwork, key) => {
                return(
                  <div class="col col-sm one">
                    <div class="box" key={key}>
                      <div>{artwork.name}</div>
                      { !artwork.waterMarkedHash
                        ? <h2>It is empty</h2>
                        : <NavLink to={{
                            pathname:'/gallery/image/',
                            aboutProps:{
                              artwork_id: artwork.id,
                              artwork_name: artwork.name,
                              artwork_waterMarkedHash: artwork.waterMarkedHash,
                              artwork_originalHash: artwork.originalHash,
                              price: artwork.price ,
                              owner: artwork.owner,
                              artist: artwork.artist,
                            } }}><img src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" width="100px" height="100px"></img></NavLink>
                      }
                      <div>Price: {window.web3.utils.fromWei(artwork.price.toString(), 'Ether')} Eth</div>
                      <div>Owner: {artwork.owner}</div>
                      <div>Artist: {artwork.artist}</div>
                      <div>
                        { artwork.owner !== this.props.account
                            ? <button
                                id="buy"
                                name={artwork.id}
                                data-hash={artwork.originalHash}
                                value={artwork.price}
                                onClick={this.handleChange.bind(this)}
                            >
                                Buy
                            </button>
                            : <button
                                id='download'
                                name={artwork.id}
                                data-hash={artwork.originalHash}
                                value={artwork.price}
                                onClick={this.handleChange.bind(this)}
                                >
                                  Download
                                </button>
                        }
                      </div>
                    </div>
                  </div>

                )
              })}
            </div>
          </div>
        </div>
      </Route>
    </HashRouter>   
    );
  }
}

export default Gallery;