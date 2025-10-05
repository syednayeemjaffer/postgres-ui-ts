import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";

function BasicExample() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand className="brand-text">My Website</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            <Nav.Link onClick={() => navigate("/home")}>Home</Nav.Link>
            {!token && <Nav.Link onClick={() => navigate("/login")}>Login</Nav.Link>}
            {!token && <Nav.Link onClick={() => navigate("/register")}>Register</Nav.Link>}
            {token && <Nav.Link onClick={() => navigate("/users")}>Users</Nav.Link>}
            {token && (
              <Nav.Link
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              >
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
