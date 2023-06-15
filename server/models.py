from sqlalchemy_serializer import SerializerMixin
from config import db


# class Friendship(db.Model, SerializerMixin):
#     __tablename__ = "friendships"

#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     friend_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     created_at = db.Column(db.DateTime, server_default=db.func.now())
#     updated_at = db.Column(db.DateTime, onupdate=db.func.now())

#     user = db.relationship("User", foreign_keys=[user_id], backref='user_friendships')
#     friend = db.relationship("User", foreign_keys=[friend_id], backref='friend_friendships')

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user_trips = db.relationship("Trip", backref='user')
    comments = db.relationship("Comment", backref='user')
    # user_friendships = db.relationship("Friendship", foreign_keys=[Friendship.user_id], backref='user')
    # friend_friendships = db.relationship("Friendship", foreign_keys=[Friendship.friend_id], backref='friend')

    # def add_friend(self, friend):
    #     friendship = Friendship(user=self, friend=friend)
    #     db.session.add(friendship)
    #     db.session.commit()

    # def remove_friend(self, friend):
    #     friendship = self.friendships.filter_by(friend_id=friend.id).first()
    #     if friendship:
    #         db.session.delete(friendship)
    #         db.session.commit()

    # def get_friends(self):
    #     return self.friendships.all()

class Trip(db.Model, SerializerMixin):
    __tablename__ = "trips"

    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.String)
    end = db.Column(db.String)
    start_coords = db.Column(db.String)
    end_coords = db.Column(db.String)
    distance = db.Column(db.Integer)
    distance_start_mid = db.Column(db.Integer)
    distance_end_mid = db.Column(db.Integer)
    midpoint_coords = db.Column(db.String)
    midpoint = db.Column(db.String)
    status = db.Column(db.String)
    duration = db.Column(db.Integer)
    duration_start_mid = db.Column(db.Integer)
    duration_end_mid = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    # user = db.relationship("User", backref='user_trips')
    places = db.relationship("Place", backref='trip')
    # comments = db.relationship("Comment", backref='trip')

    def trip_info(self):
        serialized = self.to_dict(rules=("-user", "-places"))
        serialized["username"] = self.user.username if self.user else None
        return serialized



class Place(db.Model, SerializerMixin):
    __tablename__ = "places"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    address = db.Column(db.String)
    type = db.Column(db.String)
    distance = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'))
    # trip = db.relationship("Trip", backref='places')


class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String)
    imgURL = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'))

    # user = db.relationship("User", backref='comments')
    trip = db.relationship("Trip", backref='comments')
