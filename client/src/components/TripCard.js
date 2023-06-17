import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Map from './Map';



function TripCard({ midpoint, start, end, created_at, created_by, total_distance, status }) {

    function calculateCreatedTime() {
        const createdDate = new Date(created_at)
        const timeDifference = Date.now() - createdDate.getTime()

        const mins = Math.floor(timeDifference / (1000 * 60))
        const hrs = Math.floor(timeDifference / (1000 * 60 * 60))
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

        let duration = ""
        if (mins < 60) {
            duration = `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
        } else if (hrs < 24) {
            duration = `${hrs} ${hrs === 1 ? 'hour' : 'hours'} ago`;
        } else {
            duration = `${days} ${days === 1 ? 'day' : 'days'} ago`;
        }
        return duration
    }

    return (
        <>
            <h1>{midpoint}</h1>
            <Map />
            <Card bg="dark" text="light" border="secondary" style={{ width: '18rem' }}>
                <Card.Img variant="top" alt="map image here" />
                <Card.Body>
                    <Card.Title>{midpoint}</Card.Title>
                    <Card.Text>
                        Status: {status}
                    </Card.Text>
                    <Button variant="primary">View Details</Button>
                </Card.Body>
                <Card.Footer className="text-muted">{calculateCreatedTime()}</Card.Footer>
            </Card>
        </>
    )
}

export default TripCard