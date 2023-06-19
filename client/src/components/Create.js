import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import '../create.css'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

function Create({ user }) {

    const history = useHistory()

    const initialState = {
        start: "",
        end: "",
        public: false,
        user_id: `${user.id}`,
    }

    const [formState, setFormState] = useState(initialState)

    function handleSubmit(e) {
        e.preventDefault()

        const postRequest = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(formState)
        }

        fetch('/create', postRequest)
            .then(r => r.json())
            .then((c) => {
                console.log(c)
                history.push(`/trip/${c.id}`)
                setFormState(initialState)
            })

    }

    function changeFormState(e) {
        const { name, value, type, checked } = e.target
        const newValue = type === 'checkbox' ? checked : value
        const updateFormState = { ...formState, [name]: newValue }

        setFormState(updateFormState)
    }

    return (
        <>
            <div className="form-container">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Your Address</Form.Label>
                        <Form.Control
                            name="start"
                            type="text"
                            value={formState.address}
                            placeholder="e.g. 12345 Street Rd, City State Zipcode"
                            style={{ width: '400px' }}
                            onChange={changeFormState}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Friend's Address</Form.Label>
                        <Form.Control
                            name="end"
                            type="text"
                            value={formState.f_address}
                            placeholder="e.g. 12345 Street Rd, City State Zipcode"
                            style={{ width: '400px' }}
                            onChange={changeFormState}
                            required />
                    </Form.Group>
                    <Form.Text className="text-muted" style={{ display: "flex", justifyContent: 'center' }}>
                        We'll never share your address with anyone else.
                    </Form.Text>
                    <br></br>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check
                            name="public"
                            type="checkbox"
                            label="Make this trip visible to the public"
                            checked={formState.public}
                            onChange={changeFormState}
                        />
                    </Form.Group>
                    <br></br>
                    <Button variant="success" type="submit">
                        Go Halfway
                    </Button>
                </Form>
            </div>
        </>
    )
}

export default Create