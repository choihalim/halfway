import React, { useEffect, useState } from 'react';
import TripCard from './TripCard';
import { useParams } from 'react-router-dom';

function TripDetail() {
    const { id } = useParams()
    const [keyword, setKeyword] = useState('')
    const [milesRadius, setMilesRadius] = useState('')
    const [tripDetails, setTripDetails] = useState(null)

    useEffect(() => {
        fetchPlaces()
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
        };

        fetch(`/${id}/places`, postRequest)
            .then((r) => r.json())
            .then(console.log)
    }

    function fetchTripDetails() {
        fetch(`/trip/${id}`)
            .then(r => r.json())
            .then((data) => setTripDetails(data))
            .catch((error) => console.log(error))
    }

    function convertMilesToMeters(miles) {
        const meters = miles * 1609.34
        return meters
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
        </>
    );
}

export default TripDetail;