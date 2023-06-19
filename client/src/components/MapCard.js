import React, { useRef, useState, useEffect } from "react"
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'
import '../map.css'

const MapContainer = ({ google, midpoint, start, end }) => {
    const mapRef = useRef(null)

    const [position, setPosition] = useState([10, 10])

    useEffect(() => {
        setPosition(midpoint);
    }, [midpoint])

    function handleLoad(map) {
        mapRef.current = map
    }

    function handleCenter() {
        if (!mapRef.current) return

        const newPos = mapRef.current.getCenter().toJSON();
        setPosition(newPos);
    }

    const mapStyles = [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#5C5C5C" }],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#5C5C5C" }],
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
        },
        {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
        },
        {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
        },
        {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
        },
        {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#5C5C5C" }],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
        },
    ]

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Map
                onLoad={handleLoad}
                onDragEnd={handleCenter}
                google={google}
                zoom={11.5}
                center={position}
                styles={mapStyles}
                disableDefaultUI="true"
                clickableIcons="false"
            >
                <Marker
                    position={start}
                    title="Start"
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Custom icon URL
                        scaledSize: new google.maps.Size(32, 32) // Adjust the size of the icon
                    }}
                />
                <Marker
                    position={end}
                    title="End"
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        scaledSize: new google.maps.Size(32, 32)
                    }}
                />
                <Marker
                    position={midpoint}
                    title="Midpoint"
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                        scaledSize: new google.maps.Size(32, 32)
                    }}
                />
            </Map>

        </div>
    )
}

const WrappedMapComponent = GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
})(MapContainer)

function MapCard({ center, start, end }) {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

    function getCoordinates(position) {
        const [lat, lng] = position
            .replace("(", "")
            .replace(")", "")
            .split(", ")
            .map(Number);

        return { lat, lng };
    }

    const midpoint = getCoordinates(center);
    const s = getCoordinates(start);
    const e = getCoordinates(end);

    return (
        <>
            <WrappedMapComponent

                apiKey={apiKey}
                midpoint={midpoint}
                start={s}
                end={e}
            />
        </>
    )
}

export default MapCard