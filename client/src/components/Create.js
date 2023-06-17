import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import '../create.css'

function Create() {
    return (
        <>
            <div className="form-container">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Your Address</Form.Label>
                        <Form.Control type="text" placeholder="e.g. 12345 Street Rd, City State Zipcode" style={{ width: '400px' }} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Friend's Address</Form.Label>
                        <Form.Control type="text" placeholder="e.g. 12345 Street Rd, City State Zipcode" style={{ width: '400px' }} />
                    </Form.Group>
                    <Form.Text className="text-muted" style={{ display: "flex", justifyContent: 'center' }}>
                        We'll never share your address with anyone else.
                    </Form.Text>
                    <br></br>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="I Agree to the Terms & Conditions" />
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