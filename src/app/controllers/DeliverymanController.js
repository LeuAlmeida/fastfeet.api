import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const { email } = req.body;

    const userExists = await Deliveryman.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: 'Deliveryman already exists.' });
    }

    const { id, name } = await Deliveryman.create(req.body);

    return res.json({ id, name, email });
  }
}

export default new DeliverymanController();
