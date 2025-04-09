"""Add ondelete CASCADE to User.professor_id

Revision ID: 74feb7958983
Revises: 6e3a72b73b0b
Create Date: 2025-04-09 10:21:30.732191

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '74feb7958983'
down_revision: Union[str, None] = '6e3a72b73b0b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_constraint('users_professor_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(
            'users_professor_id_fkey',
            'professor_information',
            ['professor_id'],
            ['professor_id'],
            ondelete='CASCADE'
        )

def downgrade():
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_constraint('users_professor_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(
            'users_professor_id_fkey',
            'professor_information',
            ['professor_id'],
            ['professor_id']
        )
