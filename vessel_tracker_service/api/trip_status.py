from enum import Enum
from enum import unique


@unique
class TripStatus(Enum):
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETE = 'COMPLETE'