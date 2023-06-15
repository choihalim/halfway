from flask import Flask, request, make_response, jsonify
from flask_restful import Resource

from config import app, db, api
from secret import API_KEY
from models import User, Trip, Place, Comment#, Friendship

import requests
from urllib.parse import urlencode
from geopy.distance import geodesic
from bisect import bisect_left
import polyline

def get_lat_lng(address):
    data_type = 'json'
    endpoint = f"https://maps.googleapis.com/maps/api/geocode/{data_type}"
    params = {"address": f"{address}", "key": API_KEY}
    url_params = urlencode(params)
    url = f"{endpoint}?{url_params}"
    r = requests.get(url)
    if r.status_code not in range(200, 299):
        return {}
    latlng = {}
    try:
        latlng = r.json()['results'][0]['geometry']['location']
    except:
        pass
    return latlng.get("lat"), latlng.get("lng")

def get_address(lat, lng):
    data_type = 'json'
    endpoint = f"https://maps.googleapis.com/maps/api/geocode/{data_type}"
    params = {"latlng": f"{lat},{lng}", "key": API_KEY}
    url_params = urlencode(params)
    url = f"{endpoint}?{url_params}"
    r = requests.get(url)
    if r.status_code not in range(200, 299):
        return None
    address = None
    try:
        address = r.json()['results'][0]['formatted_address']
    except:
        pass
    return address

def get_midpoint(start, end):
    start_coords = get_lat_lng(start)
    end_coords = get_lat_lng(end)

    # total_distance = distance(start_coords, end_coords).kilometers

    if not start_coords or not end_coords:
        return None
    
    endpoint = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": f"{start_coords[0]},{start_coords[1]}",
        "destination": f"{end_coords[0]},{end_coords[1]}",
        "key": API_KEY
    }
    url_params = urlencode(params)
    url = f"{endpoint}?{url_params}"
    r = requests.get(url)

    if r.status_code not in range(200, 299):
        return None
    
    data = r.json()

    if data["status"] != "OK" or "routes" not in data or len(data["routes"]) == 0:
        return None
    
    polyline_str = data["routes"][0]["overview_polyline"]["points"]
    decoded_polyline = polyline.decode(polyline_str)

    route = data["routes"][0]
    steps = route["legs"][0]["steps"]

    cumulative_durations = []
    cumulative_distance = 0
    for step in steps:
        duration = step["duration"]["value"]  # Time in seconds
        cumulative_distance += step["distance"]["value"]
        cumulative_durations.append(cumulative_distance)

    total_duration = cumulative_durations[-1]
    midpoint_duration = total_duration / 2

    midpoint_index = bisect_left(cumulative_durations, midpoint_duration)
    if midpoint_index == len(cumulative_durations):
        midpoint_index -= 1

    prev_duration = cumulative_durations[midpoint_index - 1]
    next_duration = cumulative_durations[midpoint_index]
    prev_step = steps[midpoint_index - 1]
    next_step = steps[midpoint_index]

    prev_step_duration = prev_step["duration"]["value"]
    next_step_duration = next_step["duration"]["value"]

    remaining_duration = midpoint_duration - prev_duration
    fraction = remaining_duration / (next_duration - prev_duration)

    midpoint_lat = prev_step["end_location"]["lat"] + (next_step["end_location"]["lat"] - prev_step["end_location"]["lat"]) * fraction
    midpoint_lng = prev_step["end_location"]["lng"] + (next_step["end_location"]["lng"] - prev_step["end_location"]["lng"]) * fraction

    return midpoint_lat, midpoint_lng

def calculate_distance(start, end):
    url = f'https://maps.googleapis.com/maps/api/directions/json?origin={start}&destination={end}&key={API_KEY}'

    response = requests.get(url)
    data = response.json()

    if data['status'] == 'OK':
        distance = data['routes'][0]['legs'][0]['distance']['value']  # Distance in meters
        distance_miles = distance / 1609.34  # Convert meters to miles
        rounded_distance = round(distance_miles, 1)
        return rounded_distance
    else:
        return None
    
def calculate_duration(start, end):
    start_coords = f"{start[0]},{start[1]}"
    end_coords = f"{end[0]},{end[1]}"
    data_type = 'json'
    endpoint = f"https://maps.googleapis.com/maps/api/directions/{data_type}"
    params = {
        "origin": start_coords,
        "destination": end_coords,
        "key": API_KEY
    }
    url_params = urlencode(params)
    url = f"{endpoint}?{url_params}"
    r = requests.get(url)
    if r.status_code not in range(200, 299):
        return None
    try:
        duration = r.json()['routes'][0]['legs'][0]['duration']['text']
        return duration
    except:
        return None


@app.route('/')
def index():
    return ''

@app.route('/create', methods=["POST"])
def trips():
    if request.method == "POST":
        start = request.get_json()["start"]
        s = get_lat_lng(start)
        start_coords=str(s)
        print("Start Coordinates:", start_coords)
        end = request.get_json()["end"]
        e = get_lat_lng(end)
        end_coords=str(e)
        print("End Coordinates:", end_coords)
        m = get_midpoint(start, end)
        midpoint = get_address(*m)
        midpoint_coords = str(m)
        distance = str(calculate_distance(start, end))
        distance_start_mid = str(calculate_distance(start, midpoint))
        distance_end_mid = str(calculate_distance(end, midpoint))
        duration = str(calculate_duration(s, e))
        duration_start_mid = str(calculate_duration(s, m))
        duration_end_mid = str(calculate_duration(e, m))
        status = 'scheduled'
        user_id = request.get_json()["user_id"]
        new_trip = Trip(
            start=start,
            start_coords=start_coords,
            end=end,
            end_coords=end_coords,
            midpoint=midpoint,
            midpoint_coords=midpoint_coords,
            distance=distance,
            distance_start_mid=distance_start_mid,
            distance_end_mid=distance_end_mid,
            duration=duration,
            duration_start_mid=duration_start_mid,
            duration_end_mid=duration_end_mid,
            status=status,
            user_id=user_id,
        )

        db.session.add(new_trip)
        db.session.commit()

        response = make_response(jsonify(new_trip.trip_info()), 201)
        return response

@app.route('/places', methods=["POST"])
def places():
    pass

if __name__ == '__main__':
    app.run(port=5555, debug=True)
