"""test_migration

Revision ID: 300aaed3a16a
Revises: 061a5bd7e924
Create Date: 2025-04-09 07:51:47.982571

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '300aaed3a16a'
down_revision: Union[str, None] = '061a5bd7e924'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("CREATE TABLE alembic_test (id SERIAL PRIMARY KEY, test_column VARCHAR);")

def downgrade():
    op.execute("DROP TABLE IF EXISTS alembic_test;")
