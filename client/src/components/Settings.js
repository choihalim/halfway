import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
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
                <Card.Header style={{ fontWeight: 'bold', fontSize: '24px' }}>
                    Settings
                </Card.Header>
                <Card.Body>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>User since:</strong> {calculateCreatedTime()}</p>
                    <p style={{ fontWeight: 'bold' }}>Current Default Address: </p>
                    <p style={{ textAlign: 'center' }}>{user.default_address}</p>
                    <form onSubmit={handleSubmit} style={{ marginTop: '50px', maxWidth: '500px' }}>
                        <div className="mb-3">
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
                        <Button variant="success" type="submit">
                            Change
                        </Button>
                    </form>
                </Card.Body>
            </Card>
        </>
    )
}

export default Settings