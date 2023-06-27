import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import logo from '../images/logo.png'
import '../nav.css';

function Navigation({ updateUser, user }) {

    const location = useLocation()
    const history = useHistory()

    const handleLogout = () => {
        fetch('/logout', { method: 'DELETE' })
            .then(() => {
                updateUser(null)
                history.push('/authentication')
            })
    }

    return (
        <>
            <Navbar bg='dark' sticky="top" style={{ width: '100%' }}>
                <Container>
                    <Navbar.Brand href="/home">
                        <img
                            src={logo}
                            width="200"
                            height="60"
                            className="d-inline-block align-top"
                            alt="halfway logo"
                        />
                    </Navbar.Brand>
                    <Nav className="container-fluid">
                        <Nav.Link
                            href="/home"
                            className={location.pathname === '/home' ? 'custom-nav-link active' : 'custom-nav-link'}
                        >
                            Home
                        </Nav.Link>
                        {user ?
                            <Nav.Link
                                href="/explore"
                                className={location.pathname === '/explore' ? 'custom-nav-link active' : 'custom-nav-link'}
                            >
                                Explore
                            </Nav.Link>
                            :
                            null
                        }
                        {user ?
                            null
                            :
                            <Nav.Link
                                href="/authentication"
                                className={location.pathname === '/authentication' ? 'login-nav-link active' : 'login-nav-link'}
                            >
                                Login/Signup
                            </Nav.Link>}
                        {user ?
                            <Nav.Link
                                href="/friends"
                                className={location.pathname === '/friends' ? 'custom-nav-link active' : 'custom-nav-link'}
                            >
                                Friends
                            </Nav.Link>
                            :
                            null
                        }
                        {user ?
                            <NavDropdown title={<span className="custom-nav-link">Trips</span>} id="navbarScrollingDropdown">
                                <NavDropdown.Item href="/create">Create a Trip</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/trips">
                                    My Trips
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/manage">
                                    Manage Trips
                                </NavDropdown.Item>
                            </NavDropdown>
                            :
                            null
                        }
                    </Nav>
                    <Nav>
                        {user ?
                            <Nav.Link
                                onClick={handleLogout}
                                className='logout-nav-link ms-auto'
                            >
                                Logout
                            </Nav.Link>
                            :
                            null
                        }
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default Navigation