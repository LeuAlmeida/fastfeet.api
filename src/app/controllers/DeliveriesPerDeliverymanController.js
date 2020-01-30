import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliveriesPerDeliverymanController {
  async index(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found. ' });
    }

    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        [Op.or]: [{ canceled_at: null }, { end_date: null }],
      },
      attributes: ['id', 'product', 'start_date', 'end_date', 'recipient_id'],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(deliveries);
  }
}

export default new DeliveriesPerDeliverymanController();
