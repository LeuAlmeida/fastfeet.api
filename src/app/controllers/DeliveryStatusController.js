import { Op } from 'sequelize';
import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliveryStatusController {
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

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found. ' });
    }

    const { deliveryId } = req.query;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not found. ' });
    }

    const { start_date, end_date } = req.body;

    const { product, recipient_id, signature_id } = await delivery.update({
      start_date,
      end_date,
    });

    return res.json({
      product,
      recipient_id,
      signature_id,
      start_date,
      end_date,
    });
  }
}

export default new DeliveryStatusController();
