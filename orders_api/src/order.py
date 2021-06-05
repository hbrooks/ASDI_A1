class Order():

    def __init__(self, contents, address, final_cost_in_USD, placed_at, estimated_delivery_at):
        self.contents = contents
        self.address = address
        self.final_cost = final_cost_in_USD
        self.placed_at = placed_at
        self.estimated_delivery_at = estimated_delivery_at

    def to_dict(self):
        return {
            'contents': self.contents,
            'address': self.address,
            'finalCost': self.final_cost,
            'placedAt': self.placed_at,
            'estimatedDeliveryAt': self.estimated_delivery_at,
        }
