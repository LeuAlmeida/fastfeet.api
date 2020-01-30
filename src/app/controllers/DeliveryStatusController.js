import { Op } from 'sequelize';
import * as Yup from 'yup';
import { startOfDay, isBefore } from 'date-fns';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

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

    /**
     * Deliveryman verifier
     */

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found. ' });
    }

    /**
     * Delivery verifier
     */

    const { deliveryId } = req.query;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not found. ' });
    }

    /**
     * Limit validators to max 5 pickups per day
     */

    const allDeliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
      },
    });

    const today = new Date();
    const thisToday = startOfDay(today);

    let countPicks = 0;

    allDeliveries.forEach(d => {
      if (isBefore(thisToday, d.start_date)) {
        countPicks++;
      }
    });

    if (countPicks >= 5) {
      res.status(400).json({
        error: 'This deliveryman has exceeded the limit of 5 pickups per day.',
      });
    }

    /**
     * Signature verifier if deliveryman try to update with end date
     */

    const { end_date } = req.query;

    if (end_date) {
      const { originalname: name, filename: path } = req.file;

      const { id: signature_id } = await File.create({
        name,
        path,
      });

      const { product, recipient_id } = await delivery.update({
        end_date,
        signature_id,
      });

      return res.json({
        product,
        recipient_id,
        signature_id,
        end_date,
      });
    }

    /**
     * End of verificaitons and start of update method
     */

    const { start_date } = req.body;

    const { product, recipient_id } = await delivery.update({
      start_date,
    });

    return res.json({
      product,
      recipient_id,
      start_date,
    });
  }
}

export default new DeliveryStatusController();
