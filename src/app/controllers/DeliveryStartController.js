import * as Yup from 'yup';
import { startOfDay, isBefore, getHours, parseISO } from 'date-fns';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliveryStartController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { deliveryId, deliverymanId } = req.params;

    /**
     * Deliveryman verifier
     */

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found. ' });
    }

    /**
     * Delivery verifier
     */

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not found. ' });
    }

    /**
     * Limit validators to max 5 pickups per day
     */

    const allDeliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliverymanId,
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
     * End of verificaitons and start of update method
     */

    const { start_date } = req.body;

    // if (!start_date && !end_date) {
    //   return res.status(400).json({ error: 'No params are declared.' });
    // }

    const startTime = getHours(parseISO(start_date));

    if (startTime < 8 || startTime >= 18) {
      return res.status(400).json({
        error: 'Delivery pickups are available only between 8am and 6pm',
      });
    }

    const { product, canceled_at, recipient_id } = await delivery.update({
      start_date,
      status: 'WITHDRAWN',
    });

    return res.json({
      product,
      recipient_id,
      canceled_at,
      end_date: delivery.end_date,
      start_date,
    });
  }
}

export default new DeliveryStartController();
