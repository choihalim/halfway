import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Map from './MapCard';
import Modal from 'react-bootstrap/Modal'
import '../modal.css'

function TripCard({ places, id, start_coords, end_coords, midpoint_coords, midpoint, start, end, created_at, created_by, total_distance, status }) {

    const [showModal, setShowModal] = useState(false)
    const [tripPlaces, setTripPlaces] = useState(null)

    const history = useHistory()

    const params = useParams()

    const currentPath = window.location.pathname

    function calculateCreatedTime() {
        const createdDate = new Date(created_at);
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
            duration = `${Math.abs(hrs)} ${Math.abs(hrs)  === 1 ? 'hour' : 'hours'} ago`;
        } else if (days < 7) {
            duration = `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else {
            const weeks = Math.floor(days / 7);
            duration = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        }
        return duration;

    }

    function fetchTripPlaces() {
        fetch(`/trip/${id}`)
            .then(r => r.json())
            .then(setTripPlaces)
    }

    function handleAddPlaces(id) {
        history.push(`/trip/${id}`)
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
                    <Card.Text>
                        {currentPath.endsWith('/explore') ? `Created by: ${created_by}` : null}
                    </Card.Text>
                    {places ? <Button variant="success" onClick={handleViewPlaces} >
                        View Places
                    </Button> : null}
                    {params.id === id || currentPath.endsWith('/explore') ? null : (
                        <Button variant="primary" onClick={() => handleAddPlaces(id)}>
                            Add Places
                        </Button>
                    )}
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