import { useEffect, useState } from "react"
import TripsContainer from './TripsContainer'

function Trips({ user }) {

    const [trips, setTrips] = useState([])

    useEffect(() => fetchTrips(), [])

    function fetchTrips() {
        fetch(`/${user.id}/trips`)
            .then(r => r.json())
            .then(setTrips)
    }

    function removeTrip(id) {
        const deleteRequest = {
            method: 'DELETE',
        }
        fetch(`/delete/${id}`, deleteRequest)
            .then(() => {
                const updatedTrips = trips.filter(trip => trip.id !== id)
                setTrips(updatedTrips)
            })
    }

    return (
        <div style={{ marginTop: "30px" }}>
            <TripsContainer trips={trips} removeTrip={removeTrip} />
        </div>
    )
}

export default Trips