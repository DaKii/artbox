import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        return (
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  < a className="nav-link">{this.props.account}</a>
                </li>
              </ul>
            </div>
          </nav>
        )
    }
}

export default Navbar;