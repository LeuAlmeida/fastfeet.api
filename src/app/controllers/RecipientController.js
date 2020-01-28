import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { name, address, number, state, city, cep } = req.body;

    const recipientExists = await Recipient.findOne({
      where: { name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists.' });
    }

    await Recipient.create(req.body);

    return res.json({
      name,
      address,
      number,
      state,
      city,
      cep,
    });
  }

  async index(req, res) {
    const recipients = await Recipient.findAll({
      attributes: [
        'id',
        'name',
        'address',
        'number',
        'complement',
        'state',
        'city',
        'cep',
      ],
    });

    if (recipients.length === 0) {
      return res.status(400).json({
        error:
          'No one recipient was found. Please register someone and try again. ',
      });
    }

    return res.json(recipients);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const recipient = await Recipient.findOne({
      where: { id },
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not found.' });
    }

    const { name } = req.body;

    if (name !== recipient.name) {
      const recipientExists = await Recipient.findOne({
        where: { name },
      });

      if (recipientExists) {
        return res
          .status(401)
          .json({ error: 'A recipient with this name already exists.' });
      }
    }

    const { address, number, state, city, cep } = await recipient.update(
      req.body
    );

    return res.json({
      name,
      address,
      number,
      state,
      city,
      cep,
    });
  }
}

export default new RecipientController();
