import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { firebaseHelper } from '../shared/FirebaseHelper';
import Navigation from '../shared/Navigation';

class Layout extends Component {
  render() {
    return (
      <div className="App">
        <Navigation></Navigation>
        <Grid className="App-container">
          <Row className="App-container__row">
            <Col md={6} mdOffset={3} className="App-container__col">
              {this.props.children}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Layout;