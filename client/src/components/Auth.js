import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import { useHistory } from 'react-router-dom'

function Auth({ updateUser }) {
    const history = useHistory();

    const initialState = {
        username: '',
        password: '',
        default_address: '',
        email: ''
    };

    const [signUp, setSignUp] = useState(false);
    const [formState, setFormState] = useState(initialState);
    const [formErrors, setFormErrors] = useState(null);
    const [isComponentMounted, setComponentMounted] = useState(true); // Add state for component mounted status

    useEffect(() => {
        return () => {
            setComponentMounted(false)
        }
    }, [])

    const renderFormErrors = () => {
        return formErrors.map((error, index) => <span key={index}>{error}</span>)
    }

    const changeFormState = (e) => {
        const { name, value } = e.target
        const updateFormState = { ...formState, [name]: value }
        setFormState(updateFormState)
    };

    const handleClick = () => setSignUp((signUp) => !signUp)

    const userLoginOrCreation = (e) => {
        e.preventDefault()

        const postRequest = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json'
            },
            body: JSON.stringify(formState)
        }

        fetch(signUp ? '/create_account' : '/login', postRequest)
            .then((r) => r.json())
            .then((user) => {
                if (isComponentMounted) { // Check if component is still mounted before updating state
                    if (!user.errors) {
                        updateUser(user)
                        history.push('/')
                        setFormState(initialState)
                    } else {
                        setFormErrors(user.errors)
                    }
                }
            });
    };

    return (
        <>
            <Card bg="dark" text="light" style={{ maxWidth: '35rem', margin: '0 auto', marginTop: '30px' }}>
                <Card.Body>
                    <div className="auth-form d-flex flex-column align-items-center">
                        <div className="auth-info">
                            <div className="d-flex flex-column align-items-center">
                                <h2 style={{ color: 'red' }}>{formErrors ? renderFormErrors() : null}</h2>
                                <h2 className="text-center">Please Log in or Sign up!</h2>
                                <h2 className="text-center">{signUp ? 'Already a member?' : 'Not a member?'}</h2>
                                <Button variant="secondary" onClick={handleClick}>
                                    {signUp ? 'Log In!' : 'Register now!'}
                                </Button>
                            </div>
                        </div>
                        <Form style={{ width: '20rem' }} onSubmit={userLoginOrCreation}>
                            {signUp ? (
                                <div>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="username"
                                            name="username"
                                            placeholder="Enter username"
                                            value={formState.username}
                                            onChange={changeFormState}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Enter email URL"
                                            value={formState.email}
                                            onChange={changeFormState}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicAddress">
                                        <Form.Label>
                                            Address
                                            <Form.Text className="text-muted" style={{ display: "flex", justifyContent: 'center' }}>
                                                We'll never share your address with anyone else.
                                            </Form.Text>
                                        </Form.Label>
                                        <Form.Control
                                            type="default_address"
                                            name="default_address"
                                            placeholder="e.g. 12345 Street Rd, City State Zipcode"
                                            value={formState.default_address}
                                            onChange={changeFormState}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={formState.password}
                                            onChange={changeFormState}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            ) : (
                                <div>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="username"
                                            name="username"
                                            placeholder="Enter username"
                                            value={formState.username}
                                            onChange={changeFormState}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={formState.password}
                                            onChange={changeFormState}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            )}
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="I'm not a robot" required />
                            </Form.Group>
                            <div className="d-flex justify-content-center">
                                <Button variant="success" type="submit">
                                    {signUp ? 'Login' : 'Register'}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Card.Body>
            </Card >
        </>
    );
}

export default Auth;