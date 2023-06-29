import { useState, useEffect } from 'react';
import TripCard from "./TripCard";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../trips.css';

function TripsContainer({ trips, removeTrip }) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }, [])

    if (isLoading) {
        return (
            <div class="center-container">
                <div class="fa-3x">
                    <i class="fa-regular fa-compass fa-spin"></i>
                </div>
            </div>
        )
    }

    return (
        <div className="trips-container">
            {trips.length > 0 ? (
                trips.map(trip => (
                    <TripCard
                        key={trip.id}
                        id={trip.id}
                        midpoint={trip.midpoint}
                        midpoint_coords={trip.midpoint_coords}
                        start={trip.start}
                        start_coords={trip.start_coords}
                        end_coords={trip.end_coords}
                        end={trip.end}
                        created_at={trip.created_at}
                        created_by={trip.username}
                        status={trip.status}
                        total_distance={trip.distance}
                        places={trip.places}
                        removeTrip={removeTrip}
                    />
                ))
            ) : (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <i style={{ color: "#f8f8f8", fontSize: '40px', marginBottom: "1rem" }} class="fa-regular fa-folder-open"></i>
                        <i class="fa-sharp fa-light fa-location-exclamation"></i>
                        <h1 style={{ color: "#f8f8f8", marginBottom: "1rem", fontSize: '50px' }}>No Trips Found...</h1>
                        <h4 style={{ color: "#f8f8f8", marginBottom: "1rem" }}>Click on the button below to create a trip!</h4>
                        <Button variant="success" href={'/create'}>Create</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TripsContainer
