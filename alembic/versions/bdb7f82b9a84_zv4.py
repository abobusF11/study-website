"""zv4

Revision ID: bdb7f82b9a84
Revises: ad42f2602c04
Create Date: 2025-05-10 16:22:25.441244

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bdb7f82b9a84'
down_revision: Union[str, None] = 'ad42f2602c04'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('metodists', sa.Column('lvl', sa.SmallInteger(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('metodists', 'lvl')
    # ### end Alembic commands ###
