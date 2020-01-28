import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
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
}

export default new RecipientController();
