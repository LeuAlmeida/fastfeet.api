// import User from '../models/User';

class SessionController {
  async index(req, res) {
    return res.json({ ok: true });
  }
}

export default new SessionController();
