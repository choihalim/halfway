"""added columns to Places

Revision ID: 1d279c2addc0
Revises: cba44d27f422
Create Date: 2023-06-28 16:09:47.475611

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1d279c2addc0'
down_revision = 'cba44d27f422'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('places', schema=None) as batch_op:
        batch_op.add_column(sa.Column('opening_hours', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('places', schema=None) as batch_op:
        batch_op.drop_column('opening_hours')

    # ### end Alembic commands ###