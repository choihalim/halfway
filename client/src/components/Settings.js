import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { useState } from 'react'

function Settings({ user }) {

    const [address, setAddress] = useState("")

    function changeDefaultAddress() {
        const patchRequest = {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify({ default_address: address }),
        }
        fetch(`/default-address/${user.id}`, patchRequest)
            .then(r => r.json())
            .then(console.log)
    }

    function handleSubmit() {
        changeDefaultAddress()
    }

    function calculateCreatedTime() {
        const createdDate = new Date(user.created_at);
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - createdDate.getTime();

        const mins = Math.floor(timeDifference / (1000 * 60)) + 240;
        const hrs = Math.round(timeDifference / (1000 * 60 * 60));
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        let duration = "";
        if (hrs < 1) {
            if (mins >= 60) {
                duration = `${Math.abs(hrs)} ${Math.abs(hrs) === 1 ? 'hour' : 'hours'} ago`;
            } else {
                duration = `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
            }
        } else if (hrs < 24 && mins >= 60) {
            duration = `${Math.abs(hrs)} ${Math.abs(hrs) === 1 ? 'hour' : 'hours'} ago`;
        } else if (days < 7) {
            duration = `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else {
            const weeks = Math.floor(days / 7);
            duration = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        }
        return duration;

    }

    return (
        <>
            <Card bg="dark" text="light" style={{ maxWidth: '1000px', height: '600px', margin: '0 auto', marginTop: '30px' }}>
                <Card.Header style={{ fontWeight: 'bold', fontSize: '24px', backgroundColor: "#505050" }}>
                    <i style={{ fontSize: '32px', padding: 15 }} class="fa-solid fa-gear"></i>
                </Card.Header>
                <Card.Body style={{ backgroundColor: "#202020" }}>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item style={{ backgroundColor: "#202020", color: "#f8f8f8" }} >
                            <p><strong>Username:</strong> {user.username}</p>
                        </ListGroup.Item>
                        <ListGroup.Item style={{ backgroundColor: "#202020", color: "#f8f8f8" }} >
                            <p><strong>Email:</strong> {user.email}</p>
                        </ListGroup.Item>
                        <ListGroup.Item style={{ backgroundColor: "#202020", color: "#f8f8f8" }} >
                            <p><strong>User since:</strong> {calculateCreatedTime()}</p>
                        </ListGroup.Item>
                        <ListGroup.Item style={{ backgroundColor: "#202020", color: "#f8f8f8" }} >
                            <p style={{ fontWeight: 'bold' }}>Current Default Address: </p>
                            <p style={{ textAlign: 'center' }}>{user.default_address}</p>
                        </ListGroup.Item>
                        <ListGroup.Item style={{ backgroundColor: "#202020", color: "#f8f8f8" }}>
                            <form onSubmit={handleSubmit} style={{ marginTop: '50px', maxWidth: '500px', marginBottom: "75px" }} className="row align-items-center">
                                <div className="col-9">
                                    <label htmlFor="address" className="form-label" style={{ fontWeight: 'bold' }}>
                                        New Default Address
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-3" style={{ marginTop: "30px" }}>
                                    <Button variant="success" type="submit" className="w-100">
                                        Change
                                    </Button>
                                </div>
                            </form>
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </>
    )
}

export default Settings