const userModel = require('../models/userModel');

const loginCon = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (!user) {
      res.status(404).send('User not found');
    }
    res.status(200).send({
      success: true,
      user,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      err,
    });
  }
};

const registerCon = async (req, res) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    req.status(201).send({
      success: true,
      newUser,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      err,
    });
  }
};

module.exports = { loginCon, registerCon };
