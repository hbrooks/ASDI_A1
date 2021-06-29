class CargoEntry:
    def __init__(self, item_id: str, quanity: int, type: str):
        self.item_id: str = item_id
        self.quanity: int = quanity
        self.type: str = type

    def to_dict(self):
        return {
            'itemId': self.item_id,
            'quanity': self.quanity,
            'type': self.type
        }
