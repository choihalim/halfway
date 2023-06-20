import { useState } from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Map from './MapCard';
import Modal from 'react-bootstrap/Modal'
import '../modal.css'

function TripCard({ id, start_coords, end_coords, midpoint_coords, midpoint, start, end, created_at, created_by, total_distance, status }) {

    const [showModal, setShowModal] = useState(false)
    const [tripPlaces, setTripPlaces] = useState(null)

    function calculateCreatedTime() {
        const createdDate = new Date(created_at)
        const currentDate = new Date()
        const timeDifference = currentDate.getTime() - createdDate.getTime();

        const mins = Math.floor(timeDifference / (1000 * 60))
        const hrs = Math.floor(timeDifference / (1000 * 60 * 60))
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

        let duration = "";
        if (mins < 60 && mins < 0) {
            duration = `${mins + 240} ${mins === 1 ? 'minute' : 'minutes'} ago`
        } else if (mins < 60) {
            duration = `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`
        } else if (hrs < 24) {
            duration = `${hrs} ${hrs === 1 ? 'hour' : 'hours'} ago`
        } else if (days < 7) {
            duration = `${days} ${days === 1 ? 'day' : 'days'} ago`
        } else {
            const weeks = Math.floor(days / 7);
            duration = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
        }
        return duration
    }

    function fetchTripPlaces() {
        fetch(`/trip/${id}`)
            .then(r => r.json())
            .then(setTripPlaces)
    }

    const handleViewPlaces = () => {
        fetchTripPlaces()
        setShowModal(true)
    }

    return (
        <>
            <Card bg="dark" text="light" border="secondary" style={{ width: '18rem' }}>
                <div style={{ position: 'relative', height: '200px' }}>
                    <Map center={midpoint_coords} start={start_coords} end={end_coords} />
                </div>
                <Card.Body>
                    <Card.Title>{midpoint}</Card.Title>
                    <Card.Text>
                        Status: {status}
                    </Card.Text>
                    <Button variant="success" onClick={handleViewPlaces} disabled={!tripPlaces || tripPlaces.places.length === 0}>
                        View Places
                    </Button>
                </Card.Body>
                <Card.Footer className="text-muted">{calculateCreatedTime()}</Card.Footer>
                {tripPlaces ? <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-dark">
                    <Modal.Header closeButton className="modal-dark-header">
                        <Modal.Title>{"trip name here"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-dark-body">
                        {tripPlaces.places.length > 1 ? (
                            tripPlaces.places.map((place, index) => (
                                <a key={index}>{place.address}</a>
                            ))
                        ) : (
                            <a>{tripPlaces.places[0].address}</a>
                        )}
                    </Modal.Body >
                    <Modal.Footer className="modal-dark-footer">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal> : null}
            </Card>
        </>
    )
}

export default TripCard