import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import * as actionCreators from '../../actions';

import './navbar.scss';

function NavComponent(props) {
  const { logout, history } = props;

  let header;
  switch (history.location.pathname.split('?')[0]) {
    case '/add-activity':
      header = 'Add Activity';
      break;
    case '/search-wods':
      header = 'Search WODs';
      break;
    case '/diary':
      header = 'Diary';
      break;
    default:
      header = 'WOD Land';
      break;
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
      { window.innerWidth > 991
        ? <Navbar.Brand href="/">WOD Land</Navbar.Brand>
        : <Navbar.Brand>{header}</Navbar.Brand>}
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

const NavComponentWithRouter = withRouter(NavComponent);

export default connect(
  null,
  dispatch => bindActionCreators(actionCreators, dispatch),
)(NavComponentWithRouter);
