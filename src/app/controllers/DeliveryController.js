import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

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

    const delivery = await Delivery.create(req.body);

    return res.json(delivery);
  }

  async update(req, res) {
    return null;
  }

  async delete(req, res) {
    return null;
  }
}

export default new DeliveryController();
