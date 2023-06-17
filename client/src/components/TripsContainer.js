import TripCard from "./TripCard"

function TripsContainer({ trips }) {
    return (
        <>
            {trips.map(trip => <TripCard key={trip.id}
                midpoint={trip.midpoint}
                start={trip.start}
                end={trip.end}
                created_at={trip.created_at}
                created_by={trip.username}
                status={trip.status}
                total_distance = {trip.distance}
            />)}
        </>
    )
}

export default TripsContainer