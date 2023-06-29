#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Trip, Comment, Place, friendship_table, FriendRequest
from sqlalchemy import delete

STATUSES = ["completed", "scheduled"]

PLACE_CATEGORIES = ["Restaurant", "Coffee/Tea", "Gas Station", "Hotel", "Parking"]

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        User.query.delete()
        Trip.query.delete()
        Comment.query.delete()
        Place.query.delete()
        FriendRequest.query.delete()
        delete_friendships = delete(friendship_table)
        commit = db.session.execute(delete_friendships)
        db.session.commit()
        # Friendship.query.delete()

        # users = []
        # for i in range(30):
        #     u = User(
        #         username=fake.simple_profile()['username'],
        #         email=fake.email(),
        #         password=fake.password()
        #     )
        #     users.append(u)
        # db.session.add_all(users)
        # db.session.commit()

        # trips = []
        # for i in range(30):
        #     t = Trip(
        #         start=str(fake.latlng()),
        #         end=str(fake.latlng()),
        #         distance=str(randint(1, 400)),
        #         midpoint=str(fake.latlng()),
        #         status=rc(STATUSES),
        #         user_id=rc(users).id
        #     )
        #     trips.append(t)
        # db.session.add_all(trips)
        # db.session.commit()

        # places = []
        # for i in range(50):
        #     random_trip = rc(trips)
        #     p = Place(
        #         name=fake.company(),
        #         address=str(fake.latlng()),
        #         type=rc(PLACE_CATEGORIES),
        #         distance=randint(1, 10),
        #         trip_id=random_trip.id
        #     )
        #     places.append(p)
        # db.session.add_all(places)
        # db.session.commit()

        # friends = []
        # for i in range(30):
        #     f = Friendship(
        #         user_id1=rc(users).id,
        #         user_id2=rc(users).id
        #     )
        #     friends.append(f)
        # db.session.add_all(friends)
        # db.session.commit()

        # comments = []
        # for i in range(50):
        #     random_trip = rc(trips)
        #     c = Comment(
        #         body=fake.sentence(nb_words=7),
        #         imgURL=fake.file_name(category='image'),
        #         trip_id=random_trip.id,
        #         user_id=random_trip.user_id
        #     )
        #     comments.append(c)
        # db.session.add_all(comments)
        # db.session.commit()

        print("Finishing seed...")
