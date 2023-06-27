from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import joinedload

from config import db


friendship_table = db.Table(
    'friendship',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('friend_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class FriendRequest(db.Model):
    __tablename__ = "friend_requests"

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    requested_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    accepted = db.Column(db.Boolean, default=False)

    requester = db.relationship('User', foreign_keys=[requester_id], viewonly=True, backref='sent_friend_requests')
    # requested = db.relationship('User', foreign_keys=[requested_id], backref='received_friend_requests', overlaps="requester,sent_friend_requests")
    requested = db.relationship('User', foreign_keys=[requested_id], backref='received_friend_requests')
    friend = db.relationship('User', foreign_keys=[requester_id], viewonly=True)

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user_trips = db.relationship("Trip", backref='user')
    comments = db.relationship("Comment", backref='user')

    friends = db.relationship(
            'User',
            secondary=friendship_table,
            primaryjoin=id == friendship_table.c.user_id,
            secondaryjoin=id == friendship_table.c.friend_id,
            backref=db.backref('friend_of', lazy='dynamic'),
            lazy='dynamic'
        )
    
    friend_requests = db.relationship(
        'FriendRequest',
        foreign_keys=[FriendRequest.requester_id],
        backref=db.backref('requested_user', lazy='joined', overlaps="received_friend_requests"),
        lazy='dynamic',
        cascade='all, delete-orphan',
        post_update=True,
        overlaps="requester,sent_friend_requests"
    )
    
    def send_friend_request(self, friend):
        if not self.is_friends_with(friend):
            # Check if friend request already exists
            if self.has_friend_request_from(friend):
                return False  # Friend request already sent

            # Create a new friend request
            friend_request = FriendRequest(requester_id=self.id, requested_id=friend.id)
            db.session.add(friend_request)
            return True  # Friend request sent

    def accept_friend_request(self, friend):
        if self.has_friend_request_from(friend):
            if self.is_friends_with(friend):
                return False 
            # Accept the friend request by adding both users as friends
            self.befriend(friend)
            friend.befriend(self)
            self.friend_requests.filter_by(friend=friend).delete()
            return True  # Friend request accepted

    def decline_friend_request(self, friend):
        if self.has_friend_request_from(friend):
            # Decline the friend request by removing it
            self.friend_requests.filter_by(friend=friend).delete()
            return True  # Friend request declined

    def has_friend_request_from(self, friend):
        return self.friend_requests.filter_by(requested_id=friend.id).first() is not None

    def befriend(self, friend):
        if not self.is_friends_with(friend):
            self.friends.append(friend)
            friend.friends.append(self)

    def unfriend(self, friend):
        if self.is_friends_with(friend):
            self.friends.remove(friend)
            friend.friends.remove(self)

    def is_friends_with(self, user):
        return self.friends.filter(friendship_table.c.friend_id == user.id).count() > 0

    def get_friends(self):
        return self.friends.all()
    
    def user_info(self):
        serialized = {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
        return serialized
    
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
    public = db.Column(db.String)
    duration = db.Column(db.Integer)
    duration_start_mid = db.Column(db.Integer)
    duration_end_mid = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    places = db.relationship("Place", backref='trip')

    def trip_info(self):
        serialized = self.to_dict(rules=("-user", "-places"))
        serialized["username"] = self.user.username if self.user else None
        serialized["places"] = [place.place_info()
                                for place in self.places] if self.places else None
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

    def place_info(self):
        serialized = self.to_dict(rules=("-trip",))
        return serialized


class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String)
    imgURL = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'))

    trip = db.relationship("Trip", backref='comments')
