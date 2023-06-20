import TripCard from "./TripCard"

function TripsContainer({ trips }) {
    return (
        <>
            {trips.map(trip => <TripCard key={trip.id}
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
            />)}
        </>
    )
}

export default TripsContainer