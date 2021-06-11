from typing import List
from typing import Dict


from .trip_status import TripStatus
from .cargo_entry import CargoEntry


class TripUpdate:

    def __init__(self, origin_port: str, destination_port: str, vessel_id: str, trip_status: TripStatus, cargo: List[CargoEntry]):
        self.origin_port: str = origin_port
        self.destination_port: str = destination_port
        self.vessel_id: str = vessel_id
        self.trip_status: TripStatus = trip_status
        self.cargo: List[CargoEntry] = cargo

    def to_dict(self) -> Dict:
        
        return {
            'originPort': self.origin_port,
            'destinationPort': self.destination_port,
            'vesselId': self.vessel_id,
            'status': self.trip_status.name,
            'cargo': [
                cargo_entry.to_dict() for cargo_entry in self.cargo 
            ]
        }