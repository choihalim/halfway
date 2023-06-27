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
        <div style={{ marginTop: "30px" }}>
            <TripsContainer trips={trips} />
        </div>
    )
}

export default Explore