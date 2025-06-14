"""zv2

Revision ID: 0bb52fb6e2c7
Revises: be5a01520d07
Create Date: 2025-05-09 16:55:13.508383

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0bb52fb6e2c7'
down_revision: Union[str, None] = 'be5a01520d07'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('courses_groups', 'course_id',
               existing_type=sa.SMALLINT(),
               type_=sa.Integer(),
               existing_nullable=True)
    op.create_foreign_key(None, 'courses_groups', 'courses', ['course_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'courses_groups', type_='foreignkey')
    op.alter_column('courses_groups', 'course_id',
               existing_type=sa.Integer(),
               type_=sa.SMALLINT(),
               existing_nullable=True)
    # ### end Alembic commands ###
