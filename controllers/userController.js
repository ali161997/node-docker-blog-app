const user = require('../model/userModel');
const bycrypt = require('bcryptjs');
exports.createUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const hashPassword = await bycrypt.hash(password, 12);

    const newUser = await user.create({
      name,
      password: hashPassword,
    });
    console.log(newUser);
    req.session.user = newUser;
    res.status(201).json({
      status: 'successful',
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      error: e,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const found = await user.findOne({ name });
    if (!found) {
      res.status(400).json({
        status: 'fail',
        error: 'user not found',
      });
      return;
    }
    const match = await bycrypt.compare(password, found.password);
    if (!match) {
      res.status(400).json({
        status: 'fail',
        error: 'incorrect username or password',
      });
      return;
    }
    req.session.user = found;
    res.status(201).json({
      status: 'successful',
      data: {
        user: found,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      error: e,
    });
  }
};
