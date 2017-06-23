import React, { Component } from 'react';
import Navigation from '../shared/Navigation';

class Layout extends Component {
  render() {
    return (
      <div className="App">
        <Navigation></Navigation>
        {this.props.children}
      </div>
    );
  }
}

export default Layout;