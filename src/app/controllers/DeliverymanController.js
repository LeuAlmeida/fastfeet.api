// import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    return res.json({ ok: true });
  }
}

export default new DeliverymanController();
