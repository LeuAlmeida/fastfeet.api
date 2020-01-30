// import Delivery from '../models/Delivery';
// import Deliveryman from '../models/Deliveryman';

class DeliveriesPerDeliverymanController {
  async index(req, res) {
    return res.json({ ok: true });
  }
}

export default new DeliveriesPerDeliverymanController();
