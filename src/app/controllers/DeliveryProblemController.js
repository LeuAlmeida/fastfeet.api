import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  async index(req, res) {
    const { id } = req.params;

    if (id) {
      /**
       * List all problems from a delivery based on id of this
       */

      const problemsInDelivery = await DeliveryProblem.findAll({
        where: {
          delivery_id: id,
        },
        attributes: ['id', 'description'],
      });

      if (problemsInDelivery.length === 0) {
        return res.status(400).json({ error: 'This delivery has no problem.' });
      }

      return res.json(problemsInDelivery);
    }

    const problems = await DeliveryProblem.findAll({
      attributes: ['id', 'description', 'delivery_id'],
    });

    return res.json(problems);
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
