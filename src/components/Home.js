import React, { Component } from "react";
import {
    NavLink,
  } from "react-router-dom";

import { Modal, Button } from "react-bootstrap";

class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {
        showModal: false,
        artwork : null
        };


        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal(id){
        const artwork_id = id - 1

        this.setState({ 
          showModal: true,
          artwork: this.props.artworks[artwork_id]
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
                    <p className='artist'> owner.</p>
                    <p>{artwork.owner}</p>
                  </div>
    
                  <hr></hr>
                  


    
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


    

    render() {
        const buildModelTag = this.buildModelTag();
        var artwork_id = Math.floor((Math.random() * this.props.artworks.length - 1) + 1);
        var artwork = this.props.artworks[artwork_id]
        if(artwork !== null || artwork !== undefined) {
            for (var key in artwork)
                if(key == 'waterMarkedHash'){
                    var waterMarkedHash = artwork[key]
                    console.log(waterMarkedHash)
                } 
                else if (key == 'name'){
                    var name = artwork[key]
                }
                else if (key == 'artist'){
                    var artist = artwork[key]
                }
                else if (key == 'id'){
                    var id = artwork[key]
                    console.log(id)
                }
        }
        return(
            
            <div className='container-fluid'>
                <div className='header-home'>
                    <h2>welcome to artbox.</h2>
                    <br></br>
                </div>

                <div className='content'>
                    <div className='image-block'>
                        <a className='image' onClick={this.handleOpenModal.bind(this,id)}>
                            <img className='shadow-lg' id='home-image' src= {'https://ipfs.infura.io/ipfs/' + waterMarkedHash} alt="artwork" ></img>
                        </a>   
                        <div className='title'>
                            {name}
                        </div> 
                        <div className='artist'>
                            created by {artist}.
                        </div>
                    </div>      
                    <div className='artwork-count'>
                        <div className='bold'>There are currently {this.props.artworkCount} artworks in the gallery</div>
                    </div>    

                    <div className='start-timeline'>
                        <div className='rounded-circle shadow-sm'></div>    
                    </div>  

                    {buildModelTag}
                </div>
                <div className='container-fluid divider'>
                    <div class="row justify-content-center">
                        <div class="col-6">
                        </div>
                        <div class="col-6 v-divider">
                            <div className='container-fluid timeline'>

                                
                                <div className='row align-items-center'>
                                    <div className='block'>
                                        <div className='title'><div className='bold'>about us.</div></div>
                                        <div className='description'>
                                            artbox. is a digital artwork sharing platform built on the Ethereum blockchain for artists to upload their images  
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div class="row justify-content-center">
                        <div class="col-6">
                            <div className='container-fluid timeline'>

                                
                                <div className='row align-items-center'>
                                    <div className='block'>
                                        <div className='title'><div className='bold'>what you can do here.</div></div>
                                        <div className='description'>
                                            You are able to store details of your ownership of a particular artwork on the Ethereum network by buying or creating artwork
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div class="col-6 v-divider">
                        </div>
                    </div>

                    <div class="row justify-content-center">
                        <div class="col-6">
                        </div>
                        <div class="col-6 v-divider">
                            <div className='container-fluid timeline'>

                                
                                <div className='row align-items-center'>
                                    <div className='block'>
                                        <div className='title'><div className='bold'>created by.</div></div>
                                        <div className='description'>
                                            artbox. was created by Justine Quiapos as a part of his Final Year Project throughout his 4th year at Technological University Dublin
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div class="row justify-content-center">
                        <div class="col-6">
                            <div className='container-fluid timeline'>
                                <div className='row'>
                                    <div className='block'>
                                        <div className='title'><div className='bold'>created with.</div></div>
                                        <div className='description'>
                                            This project was created using the <strong className='bold'> Ethereum</strong> blockchain to store all the data regarding ownership of the artwork,
                                             <strong className='bold'>IPFS</strong> network was used to store the images 
                                            and <strong className='bold'>ReactJS</strong> was used for the front-end
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div class="col-6 v-divider">
                        </div>
                    </div>


                    <div className='end-timeline'>
                        <div className='rounded-circle shadow-sm'></div>    
                    </div>  

                    <div className='end-block'>
                        Click the button below to start owning your own digital artwork!
                    </div>
                    <NavLink to='/gallery'><Button className='button shadow' id='home-button'>Click here to see the gallery</Button></NavLink>
                </div>

                
            </div>
        )
    }
}

export default Home;