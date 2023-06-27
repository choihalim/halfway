from flask import Flask, request, make_response, jsonify, session
from flask_restful import Resource

from config import app, db, api
from secret import API_KEY
from models import User, Trip, Place, Comment, FriendRequest

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
    if next_duration - prev_duration == 0:
        return 'invalid starting and end points'
    fraction = remaining_duration / (next_duration - prev_duration)

    midpoint_lat = prev_step["end_location"]["lat"] + (
        next_step["end_location"]["lat"] - prev_step["end_location"]["lat"]) * fraction
    midpoint_lng = prev_step["end_location"]["lng"] + (
        next_step["end_location"]["lng"] - prev_step["end_location"]["lng"]) * fraction

    return midpoint_lat, midpoint_lng

# calculates distance given start/end addresses


def calculate_distance(start, end):
    url = f'https://maps.googleapis.com/maps/api/directions/json?origin={start}&destination={end}&key={API_KEY}'

    response = requests.get(url)
    data = response.json()

    if data['status'] == 'OK':
        # Distance in meters
        distance = data['routes'][0]['legs'][0]['distance']['value']
        distance_miles = distance / 1609.34  # Convert meters to miles
        rounded_distance = round(distance_miles, 1)
        return rounded_distance
    else:
        return None

# calculates duration given start/end coordinates


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


def get_places(location, radius, search):
    endpoint = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    location = location.strip("()").replace(" ", "")
    params = {
        "key": API_KEY,
        "location": location,
        "radius": radius,
        "keyword": search
    }
    params_encoded = urlencode(params)
    places_url = f"{endpoint}?{params_encoded}"

    r = requests.get(places_url)
    if r.status_code not in range(200, 299):
        return {}
    return r.json()


def get_place_details(place_id):
    detail_endpoint = f"https://maps.googleapis.com/maps/api/place/details/json"
    detail_params = {
        "place_id": f"{place_id}",
        "fields": "name,rating,formatted_phone_number,formatted_address,icon,opening_hours,website,type",
        "key": API_KEY
    }
    detail_params_encoded = urlencode(detail_params)
    detail_url = f"{detail_endpoint}?{detail_params_encoded}"
    r = requests.get(detail_url)
    if r.status_code not in range(200, 299):
        return {}
    return r.json()


@app.route('/')
def index():
    return ''

# creates a trip and calls methods to calculate coordinates/distance/duration


@app.route('/create', methods=["POST"])
def trips():
    if request.method == "POST":
        start = request.get_json()["start"]
        s = get_lat_lng(start)
        start_coords = str(s)
        print("Start Coordinates:", start_coords)
        end = request.get_json()["end"]
        e = get_lat_lng(end)
        end_coords = str(e)
        print("End Coordinates:", end_coords)
        m = get_midpoint(start, end)
        if m is None or len(m) > 2:
            return make_response("Invalid Starting/End Points", 403)
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
        public = request.get_json()["public"]
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
            public=public
        )

        db.session.add(new_trip)
        db.session.commit()

        response = make_response(jsonify(new_trip.trip_info()), 201)
        return response


@app.route('/public_trips')
def get_public_trips():
    trips = Trip.query.filter(Trip.public == 1).all()
    serialized_trips = [trip.trip_info() for trip in trips]
    response = make_response(jsonify(serialized_trips), 200)
    return response

# gets trip details by trip id


@app.route('/trip/<int:trip_id>')
def get_trip_details(trip_id):
    trip = Trip.query.filter(Trip.id == trip_id).first()
    response = make_response(jsonify(trip.trip_info()), 200)
    return response

# gets POIs near midpoint


@app.route('/<int:trip_id>/places', methods=["POST"])
def places(trip_id):
    trip = Trip.query.filter(Trip.id == trip_id).first()
    if request.method == "POST":
        radius = request.get_json()["radius"]
        keyword = request.get_json()["keyword"]
        location = trip.midpoint_coords
        return get_places(location, radius, keyword)

# gets detail of a specific POI


@app.route('/places/<string:place_id>')
def detail_place(place_id):
    return get_place_details(place_id)

# saves a place with associated trip id


@app.route('/<int:trip_id>/places/<string:place_id>', methods=["POST"])
def save_place(trip_id, place_id):
    trip = Trip.query.filter(Trip.id == trip_id).first()
    if trip:
        if request.method == "POST":
            place_details = get_place_details(place_id)
            name = place_details["result"]["name"]
            address = place_details["result"]["formatted_address"]
            type = place_details["result"]["types"][0]
            distance = str(calculate_distance(trip.start, address))
            trip_id = trip.id
            new_place = Place(
                name=name,
                address=address,
                type=type,
                distance=distance,
                trip_id=trip_id
            )
            db.session.add(new_place)
            db.session.commit()

            response = make_response(jsonify(new_place.place_info()), 201)
            return response


@app.route('/delete/<int:trip_id>', methods=['DELETE'])
def delete_trip(trip_id):
    trip = Trip.query.filter(Trip.id == trip_id).first()
    if trip:
        if request.method == 'DELETE':
            db.session.delete(trip)
            db.session.commit()
            response = make_response('', 204)
            return response


@app.route('/<int:user_id>/trips')
def user_trips(user_id):
    user = User.query.filter(User.id == user_id).first()
    if user:
        trips = user.user_trips
        serialized_trips = [trip.trip_info() for trip in trips]
        return make_response(jsonify(serialized_trips), 200)
    
@app.route('/default-address/<int:user_id>', methods=['GET', 'PATCH'])
def user_default_address(user_id):
    user = User.query.filter(User.id == user_id).first()
    if user:
        if request.method == 'GET':
            default_address = user.default_address
            response = make_response(jsonify(default_address), 200)
            return response
        elif request.method == 'PATCH':
            new_default_address = request.json.get('default_address')

            if not new_default_address:
                return jsonify({'error': 'Invalid data'}), 400
            
            user.default_address = new_default_address
            db.session.commit()

            return jsonify({'message': 'successfully updated default address'}), 200


@app.route('/login', methods=["POST"])
def login():
    if request.method == "POST":
        rq = request.get_json()
        user = User.query.filter(User.username.like(f"%{rq['username']}%"),
                                 User.password == rq['password']).first()

        if user:
            session['user_id'] = user.id
            print(session['user_id'])
            return make_response(user.user_info(), 200)
        else:
            return {'errors': ['Invalid username/password. Please try again.']}, 401


@app.route('/authorize')
def authorize_session():
    user_id = session.get('user_id')
    if not user_id:
        return {'errors': 'You must be logged in to do that. Please log in or make an account.'}, 401
    else:
        user = User.query.filter(User.id == user_id).first()
        if user:
            return make_response(user.user_info(), 200)


@app.route('/logout', methods=["DELETE"])
def logout():
    if request.method == "DELETE":
        session['user_id'] = None
        session.clear()
        if session.get('user_id'):
            del session['user_id']
        response = make_response('', 204)
        response.set_cookie('session', '', expires=0)
        response.delete_cookie('remember_token')
        return response


@app.route('/create_account', methods=["POST"])
def create_account():
    if request.method == "POST":
        rq = request.get_json()
        new_user = User(
            username=rq['username'],
            password=rq['password'],
            default_address=rq['default_address'],
            email=rq['email']
        )
        if new_user:
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return make_response(new_user.user_info(), 201)
        else:
            return {'errors': ['Missing username/password or email. Please try again.']}, 401


@app.route('/friends/<int:id>', methods=['GET'])
def get_friends(id):
    user_id = id
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return {'errors': ['User not found']}, 404

    friends = user.friends

    if not friends:
        return {'message': 'No friends found'}, 200

    serialized_friends = []

    for friend in friends:
        serialized_friends.append({
            'id': friend.id,
            'username': friend.username,
            'default_address': friend.default_address
        })

    return make_response(serialized_friends, 200)


@app.route('/friend-requests/sent/<int:id>', methods=['GET'])
def get_sent_friend_requests(id):
    # user_id = session.get('user_id')
    # print(user_id)
    user_id = id
    print(user_id)
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return {'errors': ['User not found']}, 404

    sent_friend_requests = user.sent_friend_requests
    # sent_friend_requests = [friend_request for friend_request in user.sent_friend_requests if friend_request.requester_id == user.id]

    if not sent_friend_requests:
        return {'message': 'No friend requests sent'}, 200

    serialized_sent_friend_requests = []

    for friend_request in sent_friend_requests:
        serialized_sent_friend_requests.append({
            'id': friend_request.id,
            'user_id': friend_request.requested_id,
            'username': friend_request.requested.username,
        })

    return {'sent_friend_requests': serialized_sent_friend_requests}, 200


@app.route('/friend-requests/received/<int:id>', methods=['GET'])
def get_received_friend_requests(id):
    # user_id = session.get('user_id')
    # print(user_id)
    user_id = id
    print(user_id)
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return {'errors': ['User not found']}, 404

    received_friend_requests = user.received_friend_requests

    if not received_friend_requests:
        return {'message': 'No friend requests received'}, 200

    serialized_received_friend_requests = []

    for friend_request in received_friend_requests:
        serialized_received_friend_requests.append({
            'id': friend_request.id,
            'user_id': friend_request.requester_id,
            'username': friend_request.requester.username,
        })

    return make_response(serialized_received_friend_requests, 200)

# sends a friend request


@app.route('/befriend/<int:id>', methods=['POST'])
def add_friend(id):
    if request.method == 'POST':
        rq = request.get_json()
        # user_id = session.get('user_id')
        user_id = id
        print(user_id)
        friend_username = rq['friend_username']

        user = User.query.filter_by(id=user_id).first()
        friend = User.query.filter_by(username=friend_username).first()

        # Check if user and friend exist
        if not user or not friend:
            return {'errors': ['User or friend not found']}, 404

        # Check if user is self
        if user is friend:
            return {'errors': ['Friendship must be between two unique users']}, 409

        # Check if friendship already exists
        if user.is_friends_with(friend):
            return {'errors': ['Friendship already exists']}, 409

        # Check if friend request already sent
        if user.has_friend_request_from(friend):
            return {'errors': ['Friend request already sent']}, 409

        friend_request_sent = user.send_friend_request(friend)
        if not friend_request_sent:
            return {'errors': ['Failed to send friend request']}, 500

        # Commit the changes to the database
        try:
            db.session.commit()
            return {'message': 'Friend request sent successfully'}, 201
        except Exception as e:
            db.session.rollback()
            print(e)
            return {'errors': ['Failed to send friend request']}, 500


@app.route('/friend-requests/accept/<int:id>', methods=['POST'])
def accept_friend_request(id):
    if request.method == 'POST':
        rq = request.get_json()
        user_id = id
        friend_request_id = rq['friend_request_id']

        user = User.query.filter_by(id=user_id).first()
        friend_request = FriendRequest.query.filter_by(
            id=friend_request_id, requested=user).first()

        if not user or not friend_request:
            return {'errors': ['User or friend request not found']}, 404

        friend = friend_request.requester

        if user.is_friends_with(friend):
            return {'errors': ['Friendship already exists']}, 409

        if friend_request in user.received_friend_requests:
            user.friends.append(friend)
            friend.friends.append(user)
            db.session.delete(friend_request)
            # user.accept_friend_request(friend)

        try:
            db.session.commit()
            return {'message': 'Friend request accepted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            print(e)
            return {'errors': ['Failed to accept friend request']}, 500

@app.route('/friend-requests/deny/<int:id>', methods=['POST'])
def deny_friend_request(id):
    if request.method == 'POST':
        rq = request.get_json()
        user_id = id
        friend_request_id = rq['friend_request_id']

        user = User.query.filter_by(id=user_id).first()
        friend_request = FriendRequest.query.filter_by(
            id=friend_request_id, requested=user).first()

        if not user or not friend_request:
            return {'errors': ['User or friend request not found']}, 404

        if friend_request in user.received_friend_requests:
            db.session.delete(friend_request)

        try:
            db.session.commit()
            return {'message': 'Friend request denied successfully'}, 200
        except Exception as e:
            db.session.rollback()
            print(e)
            return {'errors': ['Failed to deny friend request']}, 500

@app.route('/remove-friend/<int:id>', methods=['POST'])
def remove_friend(id):
    if request.method == 'POST':
        rq = request.get_json()
        user_id = id
        friend_id = rq['friend_id']

        user = User.query.filter_by(id=user_id).first()
        friend = User.query.filter_by(id=friend_id).first()

        if user is friend:
            return {'errors': ['Users are not friends with themselves']}, 409

        if not user or not friend:
            return {'errors': ['User or friend not found']}, 404

        if not user.is_friends_with(friend):
            return {'errors': ['Friendship does not exist']}, 404

        user.unfriend(friend)

        try:
            db.session.commit()
            return {'message': 'Friend removed successfully'}, 200
        except Exception as e:
            db.session.rollback()
            print(e)
            return {'errors': ['Failed to remove friend']}, 500


if __name__ == '__main__':
    app.run(port=5555, debug=True)
