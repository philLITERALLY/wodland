import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import './navbar.css';

const WODMenu = (
  <NavDropdown title="WODs" id="collasible-nav-dropdown">
    <NavDropdown.Item href="/WODs/New-WOD">New WOD</NavDropdown.Item>
    <NavDropdown.Item href="/WODs/By-Date">By Date</NavDropdown.Item>
    <NavDropdown.Item href="/WODs/By-Excercise">By Excercise</NavDropdown.Item>
    <NavDropdown.Item href="/WODs/Tried-Before">Tried Before</NavDropdown.Item>
  </NavDropdown>  
);

const GirlMenu = (
  <NavDropdown title="Girls" id="collasible-nav-dropdown">
    <NavDropdown.Item href="/Girls/New-Girl">New Girl</NavDropdown.Item>
    <NavDropdown.Item href="/Girls/By-Date">By Date</NavDropdown.Item>
    <NavDropdown.Item href="/Girls/By-Excercise">By Excercise</NavDropdown.Item>
    <NavDropdown.Item href="/Girls/Tried-Before">Tried Before</NavDropdown.Item>
  </NavDropdown>  
);

const HeroMenu = (
  <NavDropdown title="Heroes" id="collasible-nav-dropdown">
    <NavDropdown.Item href="/Heroes/New-Hero">New Hero</NavDropdown.Item>
    <NavDropdown.Item href="/Heroes/By-Date">By Date</NavDropdown.Item>
    <NavDropdown.Item href="/Heroes/By-Excercise">By Excercise</NavDropdown.Item>
    <NavDropdown.Item href="/Heroes/Tried-Before">Tried Before</NavDropdown.Item>
  </NavDropdown>  
);

function App() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/">WOD Land</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {WODMenu}
            {GirlMenu}
            {HeroMenu}
          </Nav>
          <Nav>
            <Nav.Link href="/Diary">Diary</Nav.Link>
          </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default App;
