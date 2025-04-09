"""Merge test_migration and relationship branches

Revision ID: 6e3a72b73b0b
Revises: 16289ff72f97, 300aaed3a16a
Create Date: 2025-04-09 10:20:51.017423

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6e3a72b73b0b'
down_revision: Union[str, None] = ('16289ff72f97', '300aaed3a16a')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
