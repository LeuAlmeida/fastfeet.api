import * as Yup from 'yup';

import { Interval } from 'date-fns';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import Mail from '../../lib/Mail';

class DeliveryController {
  async index(req, res) {
    const { id } = req.query;

    if (id) {
      const delivery = await Delivery.findOne({
        where: { id },
        attributes: [
          'id',
          'product',
          'canceled_at',
          'start_date',
          'end_date',
          'recipient_id',
          'deliveryman_id',
          'signature_id',
        ],
      });

      if (!delivery) {
        return res.status(400).json({ error: 'Delivery does not found.' });
      }

      return res.json(delivery);
    }

    const deliveries = await Delivery.findAll({
      attributes: [
        'id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { product, recipient_id, deliveryman_id, signature_id } = req.body;

    const recipient = await Recipient.findOne({
      where: {
        id: recipient_id,
      },
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not found.' });
    }

    const deliveryman = await Deliveryman.findOne({
      where: {
        id: deliveryman_id,
      },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found.' });
    }

    const signature = await File.findOne({
      where: {
        id: signature_id,
      },
    });

    if (!signature) {
      return res.status(400).json({ error: 'Signature does not found.' });
    }

    let delivery;

    if (recipient && deliveryman && signature) {
      delivery = await Delivery.create(req.body);

      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: `O produto ${product} já está disponível para retirada.`,
        template: 'confirmation',
        context: {
          deliveryman: deliveryman.name,
          product,
        },
      });
    }
    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      start_date: Yup.date(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not found' });
    }

    /**
     * Delivery set as canceled
     */

    const { cancel } = req.query;

    if (cancel) {
      let canceledDelivery;

      if (cancel === 'true') {
        canceledDelivery = await delivery.update({
          canceled_at: new Date(),
        });
      }

      if (cancel === 'false') {
        canceledDelivery = await delivery.update({
          canceled_at: null,
        });
      }

      return res.json(canceledDelivery);
    }

    /**
     * Delivery set as finished
     */

    const { end } = req.query;

    if (end) {
      let endedDelivery;

      if (end === 'true') {
        endedDelivery = await delivery.update({
          end_date: new Date(),
        });
      }

      if (end === 'false') {
        endedDelivery = await delivery.update({
          end_date: null,
        });
      }

      return res.json(endedDelivery);
    }

    /**
     * Delivery update
     */

    const { recipient_id, deliveryman_id, signature_id } = req.body;

    const recipient = await Recipient.findOne({
      where: {
        id: recipient_id,
      },
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not found.' });
    }

    const deliveryman = await Deliveryman.findOne({
      where: {
        id: deliveryman_id,
      },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found.' });
    }

    const signature = await File.findOne({
      where: {
        id: signature_id,
      },
    });

    if (!signature) {
      return res.status(400).json({ error: 'Signature does not found.' });
    }

    await delivery.update(req.body);

    const { start_date, end_date, canceled_at } = delivery;

    const { product } = await Delivery.findByPk(id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      product,
      start_date,
      end_date,
      canceled_at,
      recipient,
      deliveryman,
      signature,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not found.' });
    }

    await delivery.destroy();

    const allDeliveries = await Delivery.findAll({
      attributes: [
        'id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
      ],
    });

    return res.json(allDeliveries);
  }
}

export default new DeliveryController();
