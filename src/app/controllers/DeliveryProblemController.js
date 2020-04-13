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
        order: [['id', 'DESC']],
        attributes: ['id', 'description', 'createdAt'],
      });

      if (problemsInDelivery.length === 0) {
        return res.status(400).json({ error: 'This delivery has no problem.' });
      }

      return res.json(problemsInDelivery);
    }

    const problems = await DeliveryProblem.findAll({
      attributes: ['id', 'description', 'delivery_id'],
      order: [['id', 'DESC']],
    });

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { delivery_id } = req.params;

    const { description } = req.body;

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

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id,
      description,
    });

    return res.json({
      id: deliveryProblem.id,
      delivery_id,
      description,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number(),
      description: Yup.string(),
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

    const { description, delivery_id } = await problem.update(req.body);

    return res.json({
      id,
      description,
      delivery_id,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const problem = await DeliveryProblem.findByPk(id);

    if (!problem) {
      return res
        .status(400)
        .json({ error: 'Delivery problem does not found.' });
    }

    await problem.destroy();

    const allProblems = await DeliveryProblem.findAll({
      attributes: ['id', 'description', 'delivery_id'],
    });

    return res.json(allProblems);
  }
}

export default new DeliveryProblemController();
