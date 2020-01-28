// import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    return res.json({ ok: true });
  }
}

export default new RecipientController();
