import { useEffect, useState } from "react"
import TripsContainer from "./TripsContainer"

function Explore() {

    const [trips, setTrips] = useState([])

    useEffect(() => {
        fetchPublicTrips()
    }, [])

    function fetchPublicTrips() {
        fetch('/public_trips')
            .then(r => r.json())
            .then(setTrips)
    }

    return (
        <>
            <h1> Explore Page </h1>
            <TripsContainer trips={trips} />
        </>
    )
}

export default Explore