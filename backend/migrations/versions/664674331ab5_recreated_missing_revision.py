"""recreated_missing_revision

Revision ID: 664674331ab5
Revises: 74feb7958983
Create Date: 2025-04-11 10:56:10.999689

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '664674331ab5'
down_revision: Union[str, None] = '74feb7958983'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
