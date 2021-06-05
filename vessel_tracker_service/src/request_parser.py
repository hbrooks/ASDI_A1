from typing import Dict
from typing import List


from vessel_tracker_service.src.trip_update import TripUpdate
from vessel_tracker_service.src.trip_status import TripStatus
from vessel_tracker_service.src.cargo_entry import CargoEntry
from vessel_tracker_service.src.unprocessable_entity_exception import UnprocessableEntityException


class RequestParser:


    def parse_aws_lambda_event(self, dictionary_of_request_body: Dict) -> TripUpdate:
        vessel_cargo: List[CargoEntry] = []
        try:
            origin_port = dictionary_of_request_body['originPort']
            destination_port = dictionary_of_request_body['destinationPort']
            vessel_id = dictionary_of_request_body['vesselId']
            status = TripStatus[dictionary_of_request_body['status']]
            cargo_in_request = dictionary_of_request_body['cargo']
        except KeyError:
            raise UnprocessableEntityException()
        try:
            for cargo_entry in cargo_in_request:
                assert isinstance(cargo_entry, Dict)
                vessel_cargo.append(self._parse_cargo_entry(cargo_entry))
        except AssertionError:
            raise UnprocessableEntityException()
        
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
        )
