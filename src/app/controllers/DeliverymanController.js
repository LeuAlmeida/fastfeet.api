// import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const { name, email } = req.body;

    return res.json({ name, email });
  }
}

export default new DeliverymanController();
