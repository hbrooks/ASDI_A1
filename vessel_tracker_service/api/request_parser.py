from typing import Dict
from typing import List

from werkzeug.exceptions import UnprocessableEntity

from .trip_update import TripUpdate
from .trip_status import TripStatus
from .cargo_entry import CargoEntry


class RequestParser:


    def parse_trip_update_event(self, dictionary_of_request_body: Dict) -> TripUpdate:
        vessel_cargo: List[CargoEntry] = []
        try:
            origin_port = dictionary_of_request_body['originPort']
            destination_port = dictionary_of_request_body['destinationPort']
            vessel_id = dictionary_of_request_body['vesselId']
            status = TripStatus[dictionary_of_request_body['status']]
            cargo_in_request = dictionary_of_request_body['cargo']
        except KeyError:
            raise UnprocessableEntity()
        try:
            for cargo_entry in cargo_in_request:
                assert isinstance(cargo_entry, Dict)
                vessel_cargo.append(self._parse_cargo_entry(cargo_entry))
        except AssertionError:
            raise UnprocessableEntity()
        
        return TripUpdate(
            origin_port,
            destination_port,
            vessel_id,
            status,
            vessel_cargo
        )

    def _parse_cargo_entry(self, dictionary_of_cargo_entry: Dict) -> CargoEntry:
        return CargoEntry(
            dictionary_of_cargo_entry['item_id'],
            dictionary_of_cargo_entry['quanity'],
            dictionary_of_cargo_entry['type'],
        )
