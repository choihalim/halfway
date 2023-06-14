from flask import request
from flask_restful import Resource

from config import app, db, api
from models import User, Friendship, Trip, Place, Comment



if __name__ == '__main__':
    app.run(port=5555, debug=True)
