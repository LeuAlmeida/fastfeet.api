import { Op } from 'sequelize';
import * as Yup from 'yup';
import { startOfDay, isBefore, getHours, parseISO } from 'date-fns';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblem from '../models/DeliveryProblem';
import File from '../models/File';

import DeliveryCancellationMail from '../jobs/DeliveryCancellationMail';
import Queue from '../../lib/Queue';

class DeliveryStatusController {
  async index(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found. ' });
    }

    const { page = 1, end } = req.query;

    if (end) {
      const deliveries = await Delivery.findAll({
        where: {
          deliveryman_id: id,
          end_date: {
            [Op.not]: null,
          },
          canceled_at: null,
        },
        attributes: ['id', 'product', 'start_date', 'end_date', 'recipient_id'],
        limit: 10,
        offset: (page - 1) * 10,
      });

      return res.json(deliveries);
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        end_date: null,
        canceled_at: null,
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
      if (!req.file) {
        return res
          .status(400)
          .json({ error: 'You need to upload a file to end this delivery. ' });
      }

      const { originalname: name, filename: path } = req.file;

      const { id: signature_id } = await File.create({
        name,
        path,
      });

      const { product, recipient_id } = await delivery.update({
        end_date,
        signature_id,
        status: 'DELIVERED',
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

    if (!start_date && !end_date) {
      return res.status(400).json({ error: 'No params are declared.' });
    }

    const startTime = getHours(parseISO(start_date));

    console.log(startTime);

    if (startTime < 8 || startTime >= 18) {
      return res.status(400).json({
        error: 'Delivery pickups are available only between 8am and 6pm',
      });
    }

    const { product, recipient_id, canceled_at } = await delivery.update({
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

  async store(req, res) {
    const schema = Yup.object().shape({
      canceled_at: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = req.params;

    const problem = await DeliveryProblem.findByPk(id);

    if (!problem) {
      return res
        .status(400)
        .json({ error: 'Delivery problem does not found.' });
    }

    const { delivery_id } = problem;

    const delivery = await Delivery.findOne({
      id: delivery_id,
    });

    if (!delivery) {
      return res
        .status(400)
        .json({ error: 'A delivery referred to this problem are not found' });
    }

    const { canceled_at } = req.body;

    const {
      product,
      start_date,
      end_date,
      recipient_id,
      deliveryman_id,
    } = await delivery.update({
      canceled_at: canceled_at || new Date(),
      end_date: new Date(),
      status: 'CANCELED',
    });

    const deliveryman = await Deliveryman.findOne({
      where: {
        id: deliveryman_id,
      },
    });

    await Queue.add(DeliveryCancellationMail.key, {
      deliveryman,
      product,
      delivery,
      problem: problem.description,
      canceled_at: canceled_at || new Date(),
    });

    return res.json({
      id,
      delivery_id,
      product,
      start_date,
      canceled_at,
      end_date,
      recipient_id,
      deliveryman_id,
    });
  }
}

export default new DeliveryStatusController();
