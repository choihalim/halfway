"""updated friendship table

Revision ID: 13d23cc475d3
Revises: 
Create Date: 2023-06-22 14:15:07.407641

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '13d23cc475d3'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('friendship',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('friend_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['friend_id'], ['users.id'], name=op.f('fk_friendship_friend_id_users')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_friendship_user_id_users')),
    sa.PrimaryKeyConstraint('user_id', 'friend_id')
    )
    op.create_table('trips',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('start', sa.String(), nullable=True),
    sa.Column('end', sa.String(), nullable=True),
    sa.Column('start_coords', sa.String(), nullable=True),
    sa.Column('end_coords', sa.String(), nullable=True),
    sa.Column('distance', sa.Integer(), nullable=True),
    sa.Column('distance_start_mid', sa.Integer(), nullable=True),
    sa.Column('distance_end_mid', sa.Integer(), nullable=True),
    sa.Column('midpoint_coords', sa.String(), nullable=True),
    sa.Column('midpoint', sa.String(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('public', sa.String(), nullable=True),
    sa.Column('duration', sa.Integer(), nullable=True),
    sa.Column('duration_start_mid', sa.Integer(), nullable=True),
    sa.Column('duration_end_mid', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_trips_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('body', sa.String(), nullable=True),
    sa.Column('imgURL', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('trip_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['trip_id'], ['trips.id'], name=op.f('fk_comments_trip_id_trips')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_comments_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('places',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('address', sa.String(), nullable=True),
    sa.Column('type', sa.String(), nullable=True),
    sa.Column('distance', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('trip_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['trip_id'], ['trips.id'], name=op.f('fk_places_trip_id_trips')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('places')
    op.drop_table('comments')
    op.drop_table('trips')
    op.drop_table('friendship')
    op.drop_table('users')
    # ### end Alembic commands ###
