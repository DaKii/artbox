import React, { Component } from "react";
import {
    NavLink,
  } from "react-router-dom";

import './home.css'
class Home extends Component {
    render() {
        return(
            <div className='container-fluid'>
                <h2> Welcome to artbox</h2>
                <NavLink to='/gallery'><button>Gallery</button></NavLink>
            </div>
        )
    }
}

export default Home;