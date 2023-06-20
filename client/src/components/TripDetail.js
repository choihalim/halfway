import React, { useEffect, useState } from 'react'
import TripCard from './TripCard'
import Map from './MapCard'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useParams } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '../modal.css'

function TripDetail() {
    const { id } = useParams()
    const [keyword, setKeyword] = useState('')
    const [milesRadius, setMilesRadius] = useState('')
    const [tripDetails, setTripDetails] = useState(null)
    const [places, setPlaces] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [placeID, setPlaceID] = useState(null)
    const [placeIndex, setPlaceIndex] = useState(null)
    const [placeDetails, setPlaceDetails] = useState(null)


    useEffect(() => {
        fetchTripDetails()
    }, []);

    function fetchPlaces() {
        const radius = convertMilesToMeters(milesRadius)

        const postRequest = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({ radius, keyword }),
        }

        fetch(`/${id}/places`, postRequest)
            .then((r) => r.json())
            .then(setPlaces)
    }

    function fetchTripDetails() {
        fetch(`/trip/${id}`)
            .then(r => r.json())
            .then((data) => setTripDetails(data))
            .catch((error) => console.log(error))
    }

    function fetchPlaceDetails(id) {
        setPlaceDetails(null)
        setPlaceIndex(null)

        fetch(`/places/${id}`)
            .then(r => r.json())
            .then((data) => setPlaceDetails(data))
            .catch((error) => console.log(error))
    }

    function convertMilesToMeters(miles) {
        const meters = miles * 1609.34
        return meters
    }

    function formatCoordinates(coordinates) {
        const { lat, lng } = coordinates;
        return `(${lat.toFixed(15)}, ${lng.toFixed(15)})`;
    }

    function handleKeywordChange(e) {
        setKeyword(e.target.value)
    }

    function handleRadiusChange(e) {
        setMilesRadius(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault()
        fetchPlaces()
    }

    function handleSave() {
        const postRequest = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
            },
        }

        fetch(`/${tripDetails.id}/places/${placeID}`, postRequest)
            .then(r => r.json())
            .then(console.log)
    }

    function handleButtonClick(id, index) {
        setPlaceID(id)
        fetchPlaceDetails(id)
        setPlaceIndex(index)
        setShowModal(true)
    }

    function closeModal() {
        setShowModal(false); // Close the modal
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

    function renderPlaces() {
        const cards = places.results.map((place, index) =>
            <Card bg="dark" text="light" border="secondary" style={{ width: '18rem' }} key={place.place_id}>
                <Card.Title>{place.name}</Card.Title>
                <Card.Img src={place.icon} style={{ width: '25px' }}></Card.Img>
                <Card.Body>
                    {place.opening_hours && place.opening_hours.open_now ? (
                        <span style={{ color: 'green' }}>Open Now</span>
                    ) : (
                        <span style={{ color: 'orange' }}>Check Operating Hours</span>
                    )}
                    <Button variant="primary" onClick={() => handleButtonClick(place.place_id, index)}>View Details</Button>
                </Card.Body>

            </Card>
        )
        return (
            <>
                {places ? cards : null}
            </>
        )
    }

    return (
        <>
            {tripDetails && <TripCard {...tripDetails} />}
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="keyword">Keyword:</label>
                    <input
                        type="text"
                        id="keyword"
                        value={keyword}
                        onChange={handleKeywordChange}
                    />
                    <label htmlFor="radius">Radius (miles):</label>
                    <input
                        type="number"
                        id="radius"
                        value={milesRadius}
                        onChange={handleRadiusChange}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
            <div>
                {places ? renderPlaces() : null}
            </div>
            {placeDetails ?
                <Modal show={showModal} onHide={closeModal} dialogClassName="modal-dark">
                    <Modal.Header closeButton className="modal-dark-header">
                        <Modal.Title>{placeDetails.result.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-dark-body">
                        Rating: {renderStars(placeDetails.result.rating)}
                        <div className="modal-right">
                            <Button href={placeDetails.result.website} target="_blank" variant="dark">
                                Website
                            </Button>
                        </div>
                    </Modal.Body>
                    <div style={{ position: 'relative', height: '300px' }}>
                        <Map center={formatCoordinates(places.results[placeIndex].geometry.location)} start={tripDetails.start_coords} end={tripDetails.end_coords} />
                    </div>
                    <Modal.Body className="modal-dark-body">
                        {placeDetails.result.formatted_address}
                    </Modal.Body>
                    <Modal.Body className="modal-dark-body">
                        {placeDetails.result.formatted_phone_number}
                    </Modal.Body>
                    <Modal.Body className="modal-dark-body">
                        <pre>{placeDetails.result.opening_hours.weekday_text.join("\n")}</pre>
                    </Modal.Body>
                    <Modal.Footer className="modal-dark-footer">
                        <Button variant="success" onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal> : null
            }
        </>
    );
}

export default TripDetail;