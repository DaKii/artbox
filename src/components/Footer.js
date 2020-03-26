import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';

class Footer extends Component {
    render() {
        return (
        <HashRouter>
          <div className="container-fluid">
              <Route exact path='/'>
                <h2>home.</h2>
              </Route>
              <Route path='/gallery'>
                <h2>artworks.</h2>
              </Route>
              <Route  path='/profile'>
                <h2>profile.</h2>
              </Route>
          </div>
        </HashRouter>
        )
    }
}

export default Footer;