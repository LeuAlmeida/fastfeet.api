import { Op } from 'sequelize';
import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { avatar_id, email } = req.body;

    if (avatar_id) {
      const file = await File.findOne({
        where: { id: avatar_id },
      });

      if (!file) {
        return res.status(401).json({ error: 'File does not found.' });
      }
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists.' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async index(req, res) {
    const { q, deliverymanId } = req.query;

    if (q) {
      const deliveryman = await Deliveryman.findAll({
        where: {
          name: {
            [Op.iLike]: `%${q}%`,
          },
        },
        order: [['id', 'DESC']],
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      });

      if (!deliveryman) {
        return res.status(400).json({ error: 'Deliveryman does not found.' });
      }

      return res.json(deliveryman);
    }

    if (deliverymanId) {
      const deliveryman = await Deliveryman.findOne({
        where: {
          id: deliverymanId,
        },
        order: [['id', 'DESC']],
        attributes: ['id', 'name', 'email', 'avatar_id', 'created_at'],
        include: {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      });

      if (!deliveryman) {
        return res.status(400).json({ error: 'Deliveryman does not found.' });
      }

      return res.json(deliveryman);
    }

    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      order: [['id', 'DESC']],
      include: {
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      },
    });

    return res.json(deliverymans);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found.' });
    }

    await deliveryman.destroy();

    const allDeliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
    });

    return res.json(allDeliverymans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found.' });
    }

    const { email } = req.body;

    if (email) {
      const emailExists = await Deliveryman.findOne({
        where: {
          email,
          id: {
            [Op.not]: id,
          },
        },
      });

      if (emailExists) {
        return res
          .status(400)
          .json({ error: 'This email is already registered.' });
      }
    }

    const { name, avatar_id } = await deliveryman.update(req.body);

    return res.json({
      name,
      email,
      avatar_id,
    });
  }
}

export default new DeliverymanController();
