"""updated friendship table

Revision ID: 733c4191e932
Revises: 13d23cc475d3
Create Date: 2023-06-22 15:32:18.620659

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '733c4191e932'
down_revision = '13d23cc475d3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('friend_requests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('friend_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['friend_id'], ['users.id'], name=op.f('fk_friend_requests_friend_id_users')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_friend_requests_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('friend_requests')
    # ### end Alembic commands ###
