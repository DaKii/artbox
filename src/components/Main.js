import React, { Component } from 'react';

//Importing IPFS HTTP client module
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: '5001',  protocol: 'https' } )


class Main extends Component {

  /* Reading File. Need to limit to only image files */
  openFile = (event) =>{
    const imageFile = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(imageFile)
    reader.onloadend = () => {
      this.setState({ buffer : Buffer(reader.result)})
      console.log('buffer', Buffer(reader.result))
    }
  }


  // Example hash : "QmP9CSusJNj8z3M7mX4v3bsmQDoHFyqm7Q5kaWpKssKhxoV"
  ///"QmbRZQy2y5pTgspqyJbVEJr4Sc8mWfFEXNcY3rhMve52XN"
  // Example url : 	https://ipfs.infura.io/ipfs/QmbRZQy2y5pTgspqyJbVEJr4Sc8mWfFEXNcY3rhMve52XN
  onSubmit = (event) => {
    event.preventDefault()
    const name = this.artworkName.value
    const price = window.web3.utils.toWei(this.artworkPrice.value.toString(), 'Ether')
    const file = this.state.buffer
    ipfs.add(file, (error, file) => {
      console.log('IPFS result', file)
      if(error) { //Check if there is any errors when adding the array
        console.error(error)
        return
      }
      this.props.uploadArtwork(name, price, file[0].hash) 
    })
  }



  render() {
    return (
      
      <div id="content">


      <h1>Upload Artwork</h1>
        <form onSubmit={this.onSubmit}>
          <div className="form-group mr-sm-2">
            <input
              id="artworkName"
              type="text"
              ref={(input) => { this.artworkName = input }}
              className="form-control"
              placeholder="Artwork Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="artworkPrice"
              type="text"
              ref={(input) => { this.artworkPrice = input }}
              className="form-control"
              placeholder="Artwork Price"
              required />
          </div>
          <input type='file' accept='image/*' onChange={this.openFile}></input>
          <button type="submit" className="btn btn-primary">Upload</button>
      </form>

    <h2>Buy artwork</h2>
          { this.props.artworks.map((artwork, key) => {
              return(
                <div className="gallery-grid" key={key}>
                    <span>{artwork.name} hello</span>
                    <div>Price: {window.web3.utils.fromWei(artwork.price.toString(), 'Ether')} Eth</div>
                    <div>Owner: {artwork.owner}</div>
                    <div>Artist: {artwork.artist}</div>
                    { !artwork.ipfsHash
                      ? <h2>It is empty</h2>
                      : <h2><img src= {'https://ipfs.infura.io/ipfs/' + artwork.ipfsHash} alt="artwork" width="100px" height="100px"></img></h2>
                    }

                    <div>
                    { !artwork.purchased
                        ? <button
                            name={artwork.id}
                            value={artwork.price}
                            onClick={(event) => {
                            this.props.buyArtwork(event.target.name, event.target.value)
                            }}
                        >
                            Buy
                        </button>
                        : null
                    }
                    </div>
                </div>
              )

          })}
      </div>   
    );
  }
}

export default Main;