from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship

from config import db


class Friendship(db.Model, SerializerMixin):
    __tablename__ = "friendships"

    id = db.Column(db.Integer, primary_key=True)
    user_id1 = db.Column(db.Integer)
    user_id2 = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user1 = relationship("User", backref='friendships1')
    user2 = relationship("User", backref='friendships2')

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    trips = relationship("Trip", backref='user')


class Trip(db.Model, SerializerMixin):
    __tablename__ = "trips"

    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.String)
    end = db.Column(db.String)
    distance = db.Column(db.Integer)
    midpoint = db.Column(db.String)
    status = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = relationship("User", backref='trips')


class Place(db.Model, SerializerMixin):
    __tablename__ = "places"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    address = db.Column(db.String)
    type = db.Column(db.String)
    distance = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'))
    trip = relationship("Trip", backref='places')


class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String)
    imgURL = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'))

    user = relationship("User", backref='comments')
    trip = relationship("Trip", backref='comments')
