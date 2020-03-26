import React, { Component } from 'react';
import {
  NavLink,
  HashRouter
} from "react-router-dom";



class Navbar extends Component {
    render() {
        return (
          <HashRouter>
            <nav class="navbar navbar-expand-md main-nav">
              <ul class="nav navbar-nav mx-auto">
                <li class="nav-item">
                <NavLink to='/' className='nav-link'>home</NavLink>
                </li>
                <li class="nav-item">
                  <NavLink to='/gallery' className='nav-link'>gallery</NavLink>
                </li>
                <li class="nav-item">
                 <NavLink to='/profile' className='nav-link'>profile</NavLink>
                </li>
              </ul>
            </nav>
          </HashRouter>
        )
    }
}

export default Navbar;