import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Map from './MapCard';



function TripCard({ start_coords, end_coords, midpoint_coords, midpoint, start, end, created_at, created_by, total_distance, status }) {

    function calculateCreatedTime() {
        const createdDate = new Date(created_at)
        const currentDate = new Date()
        const timeDifference = currentDate.getTime() - createdDate.getTime();

        const mins = Math.floor(timeDifference / (1000 * 60))
        const hrs = Math.floor(timeDifference / (1000 * 60 * 60))
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

        let duration = "";
        if (mins < 60) {
            duration = `${mins + 240} ${mins === 1 ? 'minute' : 'minutes'} ago`
        } else if (hrs < 24) {
            duration = `${hrs} ${hrs === 1 ? 'hour' : 'hours'} ago`
        } else if (days < 7) {
            duration = `${days} ${days === 1 ? 'day' : 'days'} ago`
        } else {
            const weeks = Math.floor(days / 7);
            duration = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
        }
        return duration
    }

    return (
        <>
            <Card bg="dark" text="light" border="secondary" style={{ width: '18rem' }}>
                <div style={{ position: 'relative', height: '200px' }}>
                    <Map center={midpoint_coords} start={start_coords} end={end_coords} />
                </div>
                <Card.Body>
                    <Card.Title>{midpoint}</Card.Title>
                    <Card.Text>
                        Status: {status}
                    </Card.Text>
                    <Button variant="primary">View Places</Button>
                </Card.Body>
                <Card.Footer className="text-muted">{calculateCreatedTime()}</Card.Footer>
            </Card>
        </>
    )
}

export default TripCard