import * as Yup from 'yup';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import DeliveryConfirmationMail from '../jobs/DeliveryConfirmationMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    const { productFound, deliveryId, page = 1 } = req.query;

    if (productFound && deliveryId) {
      return res
        .status(401)
        .json({ error: 'You can use only 1 param to filter deliveries.' });
    }

    if (deliveryId) {
      const deliveries = await Delivery.findOne({
        where: {
          id: deliveryId,
        },
        order: [['id', 'DESC']],
        attributes: [
          'id',
          'product',
          'status',
          'canceled_at',
          'start_date',
          'end_date',
          'recipient_id',
          'deliveryman_id',
          'signature_id',
        ],
        include: [
          {
            model: Recipient,
            as: 'recipient',
            paranoid: false,
            attributes: [
              'id',
              'name',
              'address',
              'number',
              'complement',
              'city',
              'state',
              'cep',
            ],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'avatar_id'],
            include: {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          },
          {
            model: File,
            as: 'signature',
            attributes: ['id', 'url', 'path'],
          },
        ],
      });

      if (!deliveries) {
        return res.status(400).json({ error: 'Deliveries does not found.' });
      }

      return res.json(deliveries);
    }

    if (productFound) {
      const deliveries = await Delivery.findAll({
        where: {
          product: {
            [Op.iLike]: `%${productFound}%`,
          },
        },
        attributes: [
          'id',
          'product',
          'status',
          'canceled_at',
          'start_date',
          'end_date',
          'recipient_id',
          'deliveryman_id',
          'signature_id',
        ],
        order: [['id', 'DESC']],
        include: [
          {
            model: Recipient,
            as: 'recipient',
            paranoid: false,
            attributes: [
              'id',
              'name',
              'address',
              'number',
              'complement',
              'city',
              'state',
              'cep',
            ],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'avatar_id'],
            include: {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          },
          {
            model: File,
            as: 'signature',
            attributes: ['id', 'url', 'path'],
          },
        ],
        limit: 5,
        offset: (page - 1) * 5,
      });

      if (!deliveries) {
        return res.status(400).json({ error: 'Deliveries does not found.' });
      }

      return res.json(deliveries);
    }

    const deliveries = await Delivery.findAll({
      attributes: [
        'id',
        'product',
        'status',
        'canceled_at',
        'start_date',
        'end_date',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
      ],
      order: [['id', 'DESC']],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          paranoid: false,
          attributes: [
            'id',
            'name',
            'address',
            'number',
            'complement',
            'city',
            'state',
            'cep',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'avatar_id'],
          include: {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'url', 'path'],
        },
      ],
      limit: 5,
      offset: (page - 1) * 5,
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { product, recipient_id, deliveryman_id } = req.body;

    /**
     * Recipient validators
     */

    const recipient = await Recipient.findOne({
      where: {
        id: recipient_id,
      },
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not found.' });
    }

    /**
     * Deliveryman validators
     */

    const deliveryman = await Deliveryman.findOne({
      where: {
        id: deliveryman_id,
      },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found.' });
    }

    /**
     * Try to create the delivery and send mail request to queue
     */

    try {
      const delivery = await Delivery.create({
        product,
        recipient_id,
        deliveryman_id,
        status: 'PENDING',
      });

      await Queue.add(DeliveryConfirmationMail.key, {
        deliveryman,
        product,
        delivery,
      });

      return res.json(delivery);
    } catch (err) {
      return res.status(500).json({ error: 'Error during create delivery' });
    }
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

    /**
     * Delivery verifications
     */

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not found' });
    }

    const { recipient_id, deliveryman_id, signature_id } = req.body;

    /**
     * Recipient verifications
     */

    const recipient = await Recipient.findOne({
      where: {
        id: recipient_id,
      },
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not found.' });
    }

    /**
     * Recipient verification
     */

    const deliveryman = await Deliveryman.findOne({
      where: {
        id: deliveryman_id,
      },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found.' });
    }

    /**
     * Signature verification
     */
    let signature = null;

    if (signature_id) {
      signature = await File.findOne({
        where: {
          id: signature_id,
        },
      });

      if (!signature) {
        return res.status(400).json({ error: 'Signature does not found.' });
      }
    }

    /**
     * Delivery update (Start date, end date or another infos)
     */

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

    /**
     * Delivery validators
     */

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not found.' });
    }

    await delivery.destroy();

    /**
     * List deliveries rest
     */

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
