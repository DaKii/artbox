import React, { Component } from "react";
import {
  NavLink,
  Route,
  HashRouter,
} from "react-router-dom";

import {Modal, Row, Button, ButtonGroup,ToggleButton} from 'react-bootstrap';

class Profile extends Component {

    constructor(props) {
        super(props)

        this.state = {
        showModal: false,
        artwork : null
        };


        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal(artwork_id){
        console.log('hello')
        this.setState({ 
          showModal: true,
          artwork: this.props.artworks[artwork_id - 1]
        });
        console.log(this.state.showModal)
      }
    
      handleCloseModal () {
        this.setState({ showModal: false });
      }
    

    buildModelTag() {
        let model = null;
        const artwork = this.state.artwork
        console.log(artwork)
        if(artwork !== null){
          var current_id = artwork.id;
          var next_id = ++current_id;
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
        return(

    <HashRouter>
        <div className='container-fluid'>

          <div className='header-profile'>
            <div className='profile-pic border rounded-circle shadow'>
            </div>
            <div className='artist-name'>
              {this.props.account}.
            </div>
          </div>


          {buildModelTag}

          <div class="btn-group" role="group" aria-label="artwork-selection">
            <NavLink className='profile-nav' to='/profile/owned'>
              <button type="button" class="btn btn-secondary">
                owned.
              </button>
            </NavLink>  
            <NavLink className='profile-nav' to='/profile/created'>
              <button type="button" class="btn btn-secondary">
                created.
              </button>
            </NavLink>  
          </div>
          
          <hr></hr>

          <Route exact path='/profile/owned'>
              <div className='owned'> 
                  <h3>Owned Artwork</h3>
                  <Row xs={1} md={2} lg={3}>
                      {this.props.userOwned.map((artwork, key) => {
                          return(
                              <div class="col-sm-4">    
                                  <div class="box" key={key}>
                                      { !artwork.waterMarkedHash
                                          ? <h2>It is empty</h2>
                                          :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                                  <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                              </a>
                                      }
                                  </div>
                                  <div className='title'>{artwork.name}</div>
                              </div>
                          )
                      })}
                  </Row>
              </div>
          </Route>

          <Route exact path='/profile/created'>
              <div className='owned'>
                  <h3>Created Artwork</h3>
                  <Row xs={1} md={2} lg={3}>
                      {this.props.userCreated.map((artwork, key) => {
                          return(
                              <div class="col-sm-4">    
                                  <div class="box" key={key}>
                                      { !artwork.waterMarkedHash
                                          ? <h2>It is empty</h2>
                                          :   <a className='image' onClick={this.handleOpenModal.bind(this,artwork.id)}>
                                                  <img className='shadow' src= {'https://ipfs.infura.io/ipfs/' + artwork.waterMarkedHash} alt="artwork" ></img>
                                              </a>
                                      }
                                      <div>{artwork.name}</div>
                                  </div>
                              </div>
                          )
                      })}
                  </Row>
              </div>
          </Route>
        </div>
    </HashRouter>

        )
    }
}

export default Profile;