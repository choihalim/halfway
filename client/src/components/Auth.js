import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom'

function Auth({ updateUser }) {
    const history = useHistory();

    const initialState = {
        username: '',
        password: '',
        email: ''
    };

    const [signUp, setSignUp] = useState(false);
    const [formState, setFormState] = useState(initialState);
    const [formErrors, setFormErrors] = useState(null);
    const [isComponentMounted, setComponentMounted] = useState(true); // Add state for component mounted status

    useEffect(() => {
        return () => {
            // Cleanup function to be executed when component is unmounted
            setComponentMounted(false); // Update component mounted status
        };
    }, []);

    const renderFormErrors = () => {
        return formErrors.map((error, index) => <span key={index}>{error}</span>);
    };

    const changeFormState = (e) => {
        const { name, value } = e.target;
        const updateFormState = { ...formState, [name]: value };
        setFormState(updateFormState);
    };

    const handleClick = () => setSignUp((signUp) => !signUp);

    const userLoginOrCreation = (e) => {
        e.preventDefault();

        const postRequest = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json'
            },
            body: JSON.stringify(formState)
        };

        fetch(signUp ? '/create_account' : '/login', postRequest)
            .then((r) => r.json())
            .then((user) => {
                if (isComponentMounted) { // Check if component is still mounted before updating state
                    if (!user.errors) {
                        updateUser(user);
                        history.push('/');
                        setFormState(initialState);
                    } else {
                        setFormErrors(user.errors);
                    }
                }
            });
    };

    return (
        <>
            <div className="auth-form">
                <div className="auth-info">
                    <h2 style={{ color: 'red' }}>{formErrors ? renderFormErrors() : null}</h2>
                    <h2>Please Log in or Sign up!</h2>
                    <h2>{signUp ? 'Already a member?' : 'Not a member?'}</h2>
                    <Button variant="secondary" onClick={handleClick}>
                        {signUp ? 'Log In!' : 'Register now!'}
                    </Button>
                </div>
                <Form style={{ width: '25rem' }} onSubmit={userLoginOrCreation}>
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
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </>
    );
}

export default Auth;