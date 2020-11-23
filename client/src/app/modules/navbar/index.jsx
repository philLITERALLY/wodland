import PropTypes from 'prop-types';
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../../actions';

import './navbar.css';

class App extends React.Component {
  render() {
    const { logout, history } = this.props;

    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand>WOD Land</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" activeKey={history.location.pathname}>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/add-wod">Add WOD</Nav.Link>
              <Nav.Link href="/search-wods">Search WODs</Nav.Link>
            </Nav>
            <Nav activeKey={history.location.pathname}>
              <Nav.Link href="/diary">Diary</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link onClick={() => { if (window.confirm('Are you sure you want to logout?')) logout(history) } }>Logout</Nav.Link>
            </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

App.propTypes = {  
  logout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(
  null,
  dispatch => bindActionCreators(actionCreators, dispatch),
)(App);
