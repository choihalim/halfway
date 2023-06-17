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

    console.log(trips)

    return (
        <>
            <h1> Trips Page </h1>
            <TripsContainer trips={trips} />
        </>
    )
}

export default Trips