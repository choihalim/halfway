import { useState } from 'react'
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Map from './MapCard';
import Modal from 'react-bootstrap/Modal'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '../modal.css'

function TripCard({ places, id, start_coords, end_coords, midpoint_coords, midpoint, start, end, created_at, created_by, total_distance, status, removeTrip }) {

    const [showModal, setShowModal] = useState(false)
    const [tripPlaces, setTripPlaces] = useState(null)
    const [isDeleted, setIsDeleted] = useState(false)

    const history = useHistory()

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
            duration = `${Math.abs(hrs)} ${Math.abs(hrs) === 1 ? 'hour' : 'hours'} ago`;
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

    function handleDeleteTrip(id) {
        setIsDeleted(true)
        setTimeout(() => {
            removeTrip(id)
            setIsDeleted(false)
        }, 300)
    }

    const handleViewPlaces = () => {
        fetchTripPlaces()
        setShowModal(true)
    }

    function formatCoordinates(coordinates) {
        const { lat, lng } = coordinates;
        return `(${lat.toFixed(15)}, ${lng.toFixed(15)})`;
    }

    function renderStars(rating) {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        for (let i = 1; i <= fullStars; i++) {
            stars.push(<i key={i} className="fas fa-star"></i>)
        }

        if (hasHalfStar) {
            stars.push(<i key={fullStars + 1} className="fas fa-star-half-alt"></i>)
        }

        return stars
    }

    function formatCoordinates(locationString) {
        const latLngRegex = /[-+]?\d+(\.\d+)?/g;
        const matches = locationString.match(latLngRegex);

        if (matches && matches.length >= 2) {
            const lat = parseFloat(matches[0]);
            const lng = parseFloat(matches[1]);
            const formattedLocation = `(${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            return formattedLocation;
        } else {
            throw new Error("Invalid location string format");
        }
    }

    return (
        <>
            <Card bg="dark" text="light" border="secondary" style={{ width: '18rem' }} className={isDeleted ? 'fade-out' : ''}>
                <div style={{ position: 'relative', height: '200px' }}>
                    <Map center={midpoint_coords} start={start_coords} end={end_coords} />
                </div>
                <Card.Body>
                    <Card.Title>{midpoint}</Card.Title>
                    <Card.Text>
                        {currentPath.endsWith('/explore') ? null : `Status: ${status}`}
                    </Card.Text>
                    <Card.Text>
                        {currentPath.endsWith('/explore') ? `Created by: ${created_by}` : null}
                    </Card.Text>
                    {places && !currentPath.endsWith('/manage') ? <Button variant="success" onClick={handleViewPlaces} >
                        View Places
                    </Button> : null}
                    {currentPath.endsWith('/manage') ?
                        <div>
                            <Button variant="primary" onClick={() => handleAddPlaces(id)} style={{ marginRight: '20px' }}>
                                Add Places
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteTrip(id)}>
                                Delete Trip
                            </Button>
                        </div> : null
                    }
                </Card.Body>
                <Card.Footer className="text-muted">{calculateCreatedTime()}</Card.Footer>
                {tripPlaces ? <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-dark">
                    <Modal.Header closeButton className="modal-dark-header">
                        <Modal.Title>{midpoint}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-dark-body">
                        {tripPlaces.places.length > 1 ? (
                            tripPlaces.places.map((place, index) => (
                                <>
                                    {/* <h5 key={index} style={{ fontWeight: "bold" }}>{`${place.name} <a>(${place.type.replace(/_/g, ' ')})</a>`}</h5> */}
                                    <h5 key={place.id} style={{ fontWeight: "bold" }}>
                                        {place.name}
                                        {" "}
                                        <p style={{ fontSize: "medium" }}>({place.type.replace(/_/g, ' ')})</p>
                                    </h5>
                                    {place.price_level ? (
                                        <h6>
                                            {Array(place.price_level).fill('$').join('')}
                                        </h6>
                                    ) : null}
                                    {place.rating ?
                                        <div>
                                            {renderStars(place.rating)} {` (${place.user_ratings_total})`}
                                        </div>
                                        : null}
                                    {place.website ?
                                        <div className="modal-right">
                                            <Button href={place.website} target="_blank" variant="dark">
                                                Website
                                            </Button>
                                        </div>
                                        : null}
                                    <p>{place.address ?
                                        place.address : null}
                                    </p>
                                    <br></br>
                                    <div style={{ position: 'relative', height: '300px' }}>
                                        <Map center={formatCoordinates(place.place_coords)} start={start_coords} end={end_coords} />
                                    </div>
                                    <br></br>
                                    <p>{place.distance !== "None" ? `Distance (from you): ${place.distance} miles` : null}</p>
                                    {tripPlaces.places.length - 1 === index ? null : <hr style={{ margin: "10px 0" }} />}
                                    <br></br>
                                </>
                            ))
                        ) : (
                            <>
                                <h5 style={{ fontWeight: "bold" }}>
                                    {tripPlaces.places[0].name}
                                    {" "}
                                    <p style={{ fontSize: "medium" }}>({tripPlaces.places[0].type.replace(/_/g, ' ')})</p>
                                </h5>
                                <p>{tripPlaces.places[0].address}</p>
                                <br></br>
                                <div style={{ position: 'relative', height: '300px' }}>
                                    <Map center={formatCoordinates(tripPlaces.places[0].place_coords)} start={tripPlaces.start_coords} end={tripPlaces.end_coords} />
                                </div>
                                <br></br>
                                <p>{tripPlaces.places[0].distance !== "None" ? `Distance (from you): ${tripPlaces.places[0].distance} miles` : null}</p>
                                <br></br>
                            </>
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