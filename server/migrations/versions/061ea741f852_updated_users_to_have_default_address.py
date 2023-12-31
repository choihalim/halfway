"""updated Users to have default address

Revision ID: 061ea741f852
Revises: d0e8bc91c657
Create Date: 2023-06-26 23:07:41.584516

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '061ea741f852'
down_revision = 'd0e8bc91c657'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('default_address', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('default_address')

    # ### end Alembic commands ###
