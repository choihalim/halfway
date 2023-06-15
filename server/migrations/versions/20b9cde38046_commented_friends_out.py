"""commented friends out

Revision ID: 20b9cde38046
Revises: ed9b692691f6
Create Date: 2023-06-15 11:21:02.567364

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20b9cde38046'
down_revision = 'ed9b692691f6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('friendships')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('friendships',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('user_id', sa.INTEGER(), nullable=False),
    sa.Column('friend_id', sa.INTEGER(), nullable=False),
    sa.Column('created_at', sa.DATETIME(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DATETIME(), nullable=True),
    sa.ForeignKeyConstraint(['friend_id'], ['users.id'], name='fk_friendships_friend_id_users'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='fk_friendships_user_id_users'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
