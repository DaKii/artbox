import React, { Component } from 'react';
import {Modal, Button} from 'react-bootstrap';
import {
  NavLink
} from "react-router-dom";

//import watermarkjs library
const watermarkjs = require('watermarkjs');

//Importing IPFS HTTP client module
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: '5001',  protocol: 'https' } );


class Upload extends Component {
  //Constructors
  constructor(props){
    super(props);
    this.state = {
      buffer: null,
      originalImage: null, 
      imagePreviewUrl: null,
      waterMarkUrl: null,
      waterMarkedPreviewUrl: null,
      originalImageHash: null,
      waterMarkedHash: null,
      isWatermarked: false,
      showModal: props.showModal
    };


    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleOpenModal(){
    this.setState({ 
      showModal: true,
    });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
    
  }



  /* Reading File. Need to limit to only image files */
  openFile = (event) =>{
    if(event.target.files && event.target.files[0]){
      const imageFile = event.target.files[0]
      const reader = new window.FileReader()
      const previewReader = new window.FileReader()
      console.log(imageFile)


      if(event.target.name === 'uploadFile'){
        previewReader.onload = (event) => {
          this.setState({
            imagePreviewUrl: previewReader.result
          })
        }

        reader.onloadend = () => {
          this.setState({ 
            originalImage : Buffer(reader.result),
          })
        }
      }
        
      else {
        previewReader.onload = (event) => {
          this.setState({
            waterMarkUrl: previewReader.result
          })
        }
      }
      previewReader.readAsDataURL(imageFile)
      reader.readAsArrayBuffer(imageFile)
    }
  }

  /* aglorithm to change a dataURI to Array */
  dataURItoArray(){
    var byteString;
    if (this.state.waterMarkedPreviewUrl.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(this.state.waterMarkedPreviewUrl.split(',')[1]);
    else
        byteString = unescape(this.state.waterMarkedPreviewUrl.split(',')[1]);

    // separate out the mime component

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    this.setState({
      buffer : ia
    })
  }


  //Image Preview Tag
  buildImgPreviewTag(){
    let imgTag = null;
    if (this.state.imagePreviewUrl !== null)
      imgTag = (<div className="row">
                  <div className="small-9 small-centered columns" id="waterMarkedPreview">
                    <img className="watermarked shadow" id="waterMarkedPreview" src={this.state.imagePreviewUrl}></img>
                  </div>
                </div>);
    else {
      imgTag = (
        <div className="row" id='noPreviewRow'>
          <div className="small-9 small-centered columns" id="noPreview">
            <img className="watermarked shadow" src='https://via.placeholder.com/550'></img>
          </div>
        </div>
      );
    }
    return imgTag;
  }

  //Watermark Image Preview Tag
  buildWatermarkPreviewTag(){
    let imgTag = null;
    if (this.state.waterMarkUrl !== null)
      imgTag = (<div className="row">
                  <div className="small-9 small-centered columns">
                    <img className="img-thumbnail watermark" src={this.state.waterMarkUrl}></img>
                  </div>
                </div>);
    return imgTag;
  }


  //Watermark options Tag
  buildWatermarkTag(){
    let watermarkTag = null;
    const imgTag = this.buildWatermarkPreviewTag();
    if(this.state.isWatermarked !== false)
      watermarkTag = (
        <div className="watermarkContainer">
          <input name="uploadWatermark" type='file' accept='image/*' onChange={this.handleChange.bind(this)}></input><br></br>
          {imgTag}
          <label>
            Watermark Choices: <br></br>
            <label>
              Upper-left
              <input type='radio' name='watermark-choice' value='upper-left' onChange={this.handleChange.bind(this)}></input>
            </label>
            <br></br>
            <label>
              Bottom-left
              <input type='radio' name='watermark-choice' value='bottom-left' onChange={this.handleChange.bind(this)}></input>
            </label>
            <br></br>
            <label>
              Bottom-right
              <input type='radio' name='watermark-choice' value='bottom-right' onChange={this.handleChange.bind(this)}></input>
            </label>
            <br></br>
            <label>
              Top-right
              <input type='radio' name='watermark-choice' value='upper-right' onChange={this.handleChange.bind(this)}></input>
            </label>
            <br></br>
            <label>
              Centr
              <input type='radio' name='watermark-choice' value='center' onChange={this.handleChange.bind(this)}></input>
            </label>
          </label>
        </div>
      );
      return watermarkTag;
  }

 async waterMarkChoice(choice){
    const object = watermarkjs([this.state.imagePreviewUrl, this.state.waterMarkUrl]);
    if(choice === 'bottom-left') {
      await object.dataUrl(watermarkjs.image.lowerLeft(0.70))
      .then(function (url){
        document.querySelector('.watermarked').src = url
      })
    }
    if(choice === 'upper-left') {
      await object.dataUrl(watermarkjs.image.upperLeft(0.7))
      .then(function (url){
        document.querySelector('.watermarked').src = url
      })
    }
    if(choice === 'bottom-right') {
      await object.dataUrl(watermarkjs.image.lowerRight(0.7))
      .then(function (url){
        document.querySelector('.watermarked').src = url
      })
    }
    if(choice === 'upper-right') {
      await object.dataUrl(watermarkjs.image.upperRight(0.7))
      .then(function (url){
        document.querySelector('.watermarked').src = url
      })
    
    }

    if(choice === 'center') {
      await object.dataUrl(watermarkjs.image.center(0.7))
      .then(function (url){
        document.querySelector('.watermarked').src = url
      })
    
    }


    this.setState({
      waterMarkedPreviewUrl: document.querySelector('.watermarked').src
    })
    this.dataURItoArray()
  }
  

  //Handling event changes
  async handleChange(e){
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    if (name === 'uploadFile' || name === 'uploadWatermark'){
      this.openFile(e);
      if (this.props.onChange !==undefined){
        this.props.onChange(e);
      }
    } 

    if (name === 'isWatermarked'){
      this.buildWatermarkTag();
    }

    if (name === 'watermark-choice'){
      this.waterMarkChoice(value);
    }


    this.setState({
      [name]: value
    })
  }

  // Upload file to ipfs and set details in blockchain
  onSubmit = (event) => {

    event.preventDefault()
    const name = this.artworkName.value
    const price = window.web3.utils.toWei(this.artworkPrice.value, 'Ether')
    console.log(name,price)
    const waterMarkedImage = this.state.buffer
    const originalImage = this.state.originalImage
    ipfs.add(originalImage, (error, originalImage) => {
      console.log('IPFS result', originalImage)
      if(error) { //Check if there is any errors when adding the array
        console.error(error)
        return
      }
      this.setState({
        originalImageHash: originalImage[0].hash,
      })
      if(originalImage && waterMarkedImage !== null){
        ipfs.add(waterMarkedImage, (error, waterMarkedImage) => {
          console.log('IPFS result', waterMarkedImage)
          if(error) { //Check if there is any errors when adding the array
            console.error(error)
            return
          }
          this.setState({
            waterMarkedHash: waterMarkedImage[0].hash,
          })
          setTimeout(this.upload(name,price,this.state.originalImageHash,this.state.waterMarkedHash), 250)  
        })
      } 
      else{
        this.setState({
          waterMarkedHash: this.state.originalImageHash
        })
        setTimeout(this.upload(name,price,this.state.originalImageHash,this.state.waterMarkedHash), 250)  
      }
    })
  }

  upload(name, price, original, waterMarked){
    console.log(original,waterMarked)
    this.props.uploadArtwork(name,price,original,waterMarked)
  }


  render() {
    const imgTag = this.buildImgPreviewTag();
    const watermarkTag = this.buildWatermarkTag();
    return (
      <Modal
        size='xl'
        show={this.state.showModal} 
        dialogClassName='modal-90w'
      >
        <Modal.Header>
          upload artwork.
        </Modal.Header>
        <Modal.Body id="content">
          {imgTag}
          <form id='upload-form' onSubmit={this.onSubmit.bind(this)}>
            <div className="form-group">
              <input
                id="artworkName"
                type="text"
                ref={(input) => { this.artworkName = input }}
                className="form-control upload-input"
                placeholder="title."
                required />
            </div>
            <div className="form-group ">
              <input
                id="artworkPrice"
                type="text"
                ref={(input) => { this.artworkPrice = input }}
                className="form-control upload-input"
                placeholder="price."
                required />
            </div>
            <input name="uploadFile" type='file' accept='image/*' onChange={this.handleChange.bind(this)}></input><br></br>
            <label>
              Watermark this image 
              <input 
                name="isWatermarked"
                type='checkbox' 
                onChange={this.handleChange.bind(this)}>
              </input>
            </label>
            {watermarkTag}
            <br></br>
            <button type="submit" className="btn btn-primary" >Upload</button>
        </form>



        </Modal.Body>  
        <Modal.Footer>
          <Button variant="secondary">
            <NavLink className='nav-link' to='/gallery/' onClick={this.handleCloseModal}>Close</NavLink>
          </Button>
        </Modal.Footer>
      </Modal> 
    );
  }
}

export default Upload;