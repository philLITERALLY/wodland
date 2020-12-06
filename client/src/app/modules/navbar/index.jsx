import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../../actions';

import './navbar.scss';

function NavComponent(props) {
  const { logout, history } = props;

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/">WOD Land</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto" activeKey={history.location.pathname}>
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/add-activity">Add Activity</Nav.Link>
          <Nav.Link href="/search-wods">Search WODs</Nav.Link>
        </Nav>
        <Nav activeKey={history.location.pathname}>
          <Nav.Link href="/diary">Diary</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link onClick={
            () => {
              // eslint-disable-next-line no-alert
              if (window.confirm('Are you sure you want to logout?')) logout(history);
            }}
          >
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

NavComponent.propTypes = {
  logout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(
  null,
  dispatch => bindActionCreators(actionCreators, dispatch),
)(NavComponent);
