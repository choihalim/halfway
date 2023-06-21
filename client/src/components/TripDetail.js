import React, { useEffect, useState } from 'react'
import TripCard from './TripCard'
import Map from './MapCard'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import { useParams } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '../modal.css'
import CloseButton from 'react-bootstrap/esm/CloseButton'

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
            .then((data) => {
                console.log(data)
                closeModal()
            })
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
        const cards =
            <Container>
                <Row className="justify-content-center">
                    {places.results.map((place, index) => (
                        <Col xs={12} sm={6} md={4} lg={3} key={place.place_id} className="mb-4">
                            <Card bg="dark" text="light" border="secondary" className='shadow' style={{ width: '18rem', margin: '0 10px' }}>
                                <Card.Title className="text-center" style={{ marginTop: place.icon ? '50px' : '10px' }}>
                                    {place.name}
                                    {place.icon && <Card.Img src={place.icon} style={{ width: '25px', position: 'absolute', top: '10px', right: '10px' }} />}
                                </Card.Title>
                                <Card.Body className="d-flex flex-column align-items-center">
                                    {place.opening_hours && place.opening_hours.open_now ? (
                                        <span style={{ color: 'green' }}>Open Now</span>
                                    ) : (
                                        <span style={{ color: 'orange' }}>Check Operating Hours</span>
                                    )}
                                    <Button variant="primary" onClick={() => handleButtonClick(place.place_id, index)}>
                                        View Details
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        return (
            <>
                {places ? cards : null}
            </>
        )
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px', marginBottom: '30px' }}>
                {tripDetails && <TripCard {...tripDetails} />}

                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} sm={8} md={6}>
                            <Form onSubmit={handleSubmit} className="bg-dark text-light rounded shadow p-3" style={{ width: '400px', marginLeft: '110px', marginBottom: '20px', marginTop: '30px' }}>
                                <Row className="mb-3" style={{ width: '400px' }}>
                                    <Form.Group as={Col} controlId="keyword">
                                        <Form.Label>Keyword:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={keyword}
                                            onChange={handleKeywordChange}
                                            className="bg-dark text-light"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="radius">
                                        <Form.Label>Radius (miles):</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={milesRadius}
                                            onChange={handleRadiusChange}
                                            className="bg-dark text-light"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="d-flex align-items-end">
                                        <Button variant="primary" type="submit">
                                            Search
                                        </Button>
                                    </Form.Group>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
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
                        {placeDetails.result.rating ?
                            <div>
                                Rating: {renderStars(placeDetails.result.rating)}
                            </div> : null}
                        {placeDetails.result.website ? <div className="modal-right">
                            <Button href={placeDetails.result.website} target="_blank" variant="dark">
                                Website
                            </Button>
                        </div> : null}
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
                        <pre>{placeDetails.result.opening_hours ? placeDetails.result.opening_hours.weekday_text.join("\n") : null}</pre>
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