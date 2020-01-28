import User from '../models/User';

class UserController {
  async index(req, res) {
    return null;
  }

  async store(req, res) {
    const { email } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res
        .status(400)
        .json({ error: 'This email is already registered.' });
    }

    const { id, name } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    return null;
  }

  async update(req, res) {
    return null;
  }
}

export default new UserController();
