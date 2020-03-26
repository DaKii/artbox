import React, { Component } from 'react';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import {Row, Modal, Carousel, Button, CarouselItem } from "react-bootstrap";



//Links
import Upload from "./Upload"
import Image from './Image'



//Setting up ipfs and filesaver
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: '5001',  protocol: 'https' } );
const FileSaver = require('file-saver');



class Gallery extends Component {

  constructor(){
    super();
    this.state = {
      showModal: false,
      artwork : null
    };


    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal(artwork_id){
    this.setState({ 
      showModal: true,
      artwork: this.props.artworks[artwork_id - 1]
    });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  buildModelTag() {
    let model = null;
    const artwork = this.state.artwork
    if(artwork !== null){
      var current_id = artwork.id;
      var next_id = ++current_id;
      var prev_id = --current_id;
      let prev_artwork = 0;
      if((current_id - 2) < 0 ){
        prev_artwork = this.props.artworks[this.props.artworks.length - 1];
      }
      else if (current_id == (this.props.artworks.length)){
        prev_artwork = this.props.artworks[this.props.artworks.length - 2]
      }
      else{
        prev_artwork = this.props.artworks[current_id - 2];
      }

      if((next_id) > this.props.artworks.length){
        var next_artwork = this.props.artworks[0];
      }

      else{
        var next_artwork = this.props.artworks[--next_id];
      }


      model =  (
      <Modal 
        size='xl'
        show={this.state.showModal} 
        onHide={this.handleCloseModal}
        dialogClassName='modal-90w'
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-8'>
              <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
              <h5 className='title'>{artwork.name}.</h5>
              <p>  
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Pellentesque eu urna id augue pulvinar convallis gravida quis purus. Ut tempor massa et velit pharetra, ut elementum lacus blandit. 
              </p>
            </div>
            <div className='col'>
              <div className='profile-image shadow'>
              </div>

              <p className='artist'> artist.</p>
              <p>{artwork.artist}</p>

              <hr></hr>

              <div className='bio'>
                biography.
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Pellentesque eu urna id augue pulvinar convallis gravida quis purus. Ut tempor massa et velit pharetra, ut elementum lacus blandit. 
                </p>
              </div>

              <hr></hr>
              
              <div className='buy-price'>
                <div className='price'>
                  <h6>{window.web3.utils.fromWei(artwork.price.toString(), 'Ether')} Eth. </h6>
                </div>
                <div className='buy'>
                { artwork.owner !== this.props.account
                    ? <Button
                        id="buy"
                        className='buy-button shadow-sm'
                        variant='primary'
                        size='lg'
                        name={artwork.id}
                        data-hash={artwork.originalHash}
                        value={artwork.price}
                        onClick={this.handleChange.bind(this)}
                    >
                        buy.
                    </Button>
                    : <Button
                        id='download'
                        className='buy-button shadow-sm'
                        name={artwork.id}
                        data-hash={artwork.originalHash}
                        value={artwork.price}
                        onClick={this.handleChange.bind(this)}
                        >
                          download.
                        </Button>
                }
                </div>
                <div className='bid' >
                  <Button
                    id="bid"
                    className='bid-button shadow-sm'
                    variant='primary'
                    size='lg'
                    name={artwork.id}
                    data-hash={artwork.originalHash}
                    value={artwork.price}
                    onClick={this.handleChange.bind(this)}
                  >
                    bid.
                  </Button>
                </div>

                <p className='artist'> owner.</p>
                <p>{artwork.owner}</p>
              </div>

              <hr></hr>
              <div className='other-image'>
                <div className='title'>
                  reccomendations.
                </div>
                { prev_artwork.waterMarkedHash !== null
                  ?<a className='image' onClick={this.handleOpenModal.bind(this,prev_artwork.id)}>
                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + prev_artwork.waterMarkedHash} alt="artwork" ></img>
                  </a>
                  : <h2>Error, can't find image</h2>
                }
                { next_artwork.waterMarkedHash !== null
                  ?<a className='image' onClick={this.handleOpenModal.bind(this,next_artwork.id)}>
                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + next_artwork.waterMarkedHash} alt="artwork" ></img>
                  </a>
                  : <h2>Error, can't find image</h2>
                }
              </div>
            </div>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> 
      ); 
    }
    return model
  }

  

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
    const buildModelTag = this.buildModelTag();
    return (
    <HashRouter>
      <div className='container-fluid'>
        <Route exact path='/gallery/upload' >
          <Upload uploadArtwork={this.props.uploadArtwork} showModal={true} />
        </Route>

        <Route exact path='/gallery/image/' component={Image}>
        </Route>
        <Route  path='/gallery'>

        <NavLink to="/gallery/upload" className='upload-div'><Button className='upload'>Upload</Button></NavLink>
          <Carousel nextIcon={this.state.nextIcon} prevIcon={this.state.prevIcon} interval={null} className='carousel'>
            <CarouselItem className='carousel-item'>
              <div className='row test_gallery'>
                
                {this.props.artworks.map((artwork,key) => {
                  if(key == 0){
                    return(
                      <div className='col-sm col'>
                        <div className='row'>
                          { !artwork.waterMarkedHash
                            ? <h2>It is empty</h2>
                            :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                  <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                </a>
                          }
                        </div>
                      </div>
                    )
                  }
                  
                  if(key == 2 ){
                    return (
                      <div className='col-sm col2' key={key}>
                        <div className='row top'>
                          { !this.props.artworks[key - 1].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,this.props.artworks[key - 1].id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[key-1].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                        <div className='row bottom' key={key}> 
                        { !artwork.waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                      </div>
                    )
                  }

                  if(key == 4){
                    return(
                      <div className='col-sm col3' key={key}>
                        <div className='row top'>
                          { !this.props.artworks[key - 1].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,this.props.artworks[key - 1].id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[key - 1].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                        <div className='row bottom'> 
                          { !artwork.waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                      </div>
                    )
                  }

                  if(key == 7){
                    return(
                      <div className='col-sm-6 col4' key={key}>
                        <div className='row top'>
                          { !this.props.artworks[key - 2].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image crop' onClick={this.handleOpenModal.bind(this,this.props.artworks[key - 2].id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[key - 2].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                          </div>
                          <div className='row bottom'> 
                            <div className='col-md-6 col1'>
                            { !this.props.artworks[key - 1].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image crop' onClick={this.handleOpenModal.bind(this,this.props.artworks[key - 1].id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[key - 1].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                            }
                            </div>
                            <div className='col-md-6 col2'>
                              { !artwork.waterMarkedHash
                                ? <h2>It is empty</h2>
                                :   <a className='image crop' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                      <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                    </a>
                              }
                            </div>
                          </div>
                      </div>
                    )
                  }
                })}
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className='row test_gallery'>
                {this.props.artworks.map((artwork,key) => {
                  if(key == 8){
                    return(
                      <div className='col-sm col' key={key}>
                        <div className='row'>
                          { !artwork.waterMarkedHash
                            ? <h2>It is empty</h2>
                            :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                  <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                </a>
                          }
                        </div>
                      </div>
                    )
                  }


                  if(key == 10 ){
                    return (
                      <div className='col-sm col2' key={key}>
                        <div className='row top'>
                          { !this.props.artworks[key - 1].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,this.props.artworks[key - 1].id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[key - 1].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                        <div className='row bottom' key = {key}> 
                        { !artwork.waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                      </div>
                    )
                  }

                  if(key == 12){
                    return(
                      <div className='col-sm col3'>
                        <div className='row top'>
                          { !this.props.artworks[key - 1].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[key - 1].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                        <div className='row bottom'> 
                          { !artwork.waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                      </div>
                    )
                  }

                  if(key == 15){
                    return(
                      <div className='col-sm-6 col4' key={key}>
                        <div className='row top'>
                          { !this.props.artworks[key - 2].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[key - 2].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                          </div>
                          <div className='row bottom'> 
                            <div className='col-md-6 col1'>
                            { !this.props.artworks[key - 1].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[key - 1].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                            }
                            </div>
                            <div className='col-md-6 col2'>
                              { !artwork.waterMarkedHash
                                ? <h2>It is empty</h2>
                                :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                      <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                    </a>
                              }
                            </div>
                          </div>
                      </div>
                    )
                  }
                })}
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className='row test_gallery'>
                {this.props.artworks.map((artwork,key) => {
                  if(key == 16){
                    return(
                      <div className='col-sm col' key={key}>
                        <div className='row'>
                          { !artwork.waterMarkedHash
                            ? <h2>It is empty</h2>
                            :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                  <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                </a>
                          }
                        </div>
                      </div>
                    )
                  }


                  if(key == 18 ){
                    return (
                      <div className='col-sm col2' key={key}>
                        <div className='row top'>
                          { !this.props.artworks[1].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[1].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                        <div className='row bottom' key = {key}> 
                        { !artwork.waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                      </div>
                    )
                  }

                  if(key == 20){
                    return(
                      <div className='col-sm col3'>
                        <div className='row top'>
                          { !this.props.artworks[key - 1].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[key - 1].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                        <div className='row bottom'> 
                          { !artwork.waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                        </div>
                      </div>
                    )
                  }

                  if(key == 23){
                    return(
                      <div className='col-sm-6 col4' key={key}>
                        <div className='row top'>
                          { !this.props.artworks[key - 2].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[key - 2].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                          }
                          </div>
                          <div className='row bottom'> 
                            <div className='col-md-6 col1'>
                            { !this.props.artworks[key - 1].waterMarkedHash
                              ? <h2>It is empty</h2>
                              :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)} key={key - 1}>
                                    <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + this.props.artworks[key - 1].waterMarkedHash} alt="artwork" ></img>
                                  </a>
                            }
                            </div>
                            <div className='col-md-6 col2'>
                              { !artwork.waterMarkedHash
                                ? <h2>It is empty</h2>
                                :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                      <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                    </a>
                              }
                            </div>
                          </div>
                      </div>
                    )
                  }
                })}
              </div>
            </CarouselItem>
          </Carousel>

          {buildModelTag}
        </Route>
      </div>
    </HashRouter>   
    );
  }
}

export default Gallery;