import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  async index(req, res) {
    const deliveries = await Delivery.findAll();

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { delivery_id, description } = req.body;

    /**
     * Delivery validator
     */

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
      },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not found.' });
    }

    /**
     * Problem validator
     */

    const problemExists = await DeliveryProblem.findOne({
      where: {
        delivery_id,
      },
    });

    if (problemExists) {
      return res
        .status(400)
        .json({ error: 'A problem is already declared to this delivery.' });
    }

    const { id } = await DeliveryProblem.create(req.body);

    return res.json({
      id,
      delivery_id,
      description,
    });
  }

  async update(req, res) {
    return res.json({ ok: true });
  }

  async delete(req, res) {
    return res.json({ ok: true });
  }
}

export default new DeliveryProblemController();
