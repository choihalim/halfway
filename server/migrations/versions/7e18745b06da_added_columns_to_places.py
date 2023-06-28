"""added columns to Places

Revision ID: 7e18745b06da
Revises: 515a90ba7d40
Create Date: 2023-06-28 17:20:32.490719

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7e18745b06da'
down_revision = '515a90ba7d40'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('places', schema=None) as batch_op:
        batch_op.add_column(sa.Column('place_coords', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('places', schema=None) as batch_op:
        batch_op.drop_column('place_coords')

    # ### end Alembic commands ###