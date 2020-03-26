import React, {Component} from 'react';

class Image extends Component {
    constructor(props){
        super(props);
        this.state = {
            artwork: this.props.location.aboutProps,
            comments: [],
            loading: false
        };
    }

    render(){
        console.log(this.props.location.aboutProps)
        console.log(this.state.artwork)
        return(
            <div className='container-fluid'>
                <img src= {'https://ipfs.infura.io/ipfs/' + this.state.artwork.artwork_waterMarkedHash} alt="artwork" ></img> 
            </div>
        );
    }
}

export default Image;