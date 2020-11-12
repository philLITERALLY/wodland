import { Navbar, Nav } from 'react-bootstrap';

import './navbar.css';

function App() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/">WOD Land</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/WODs/New-WOD">Add WOD</Nav.Link>
            <Nav.Link href="/WODs/Search-WODs">Search WODs</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/Diary">Diary</Nav.Link>
          </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default App;
