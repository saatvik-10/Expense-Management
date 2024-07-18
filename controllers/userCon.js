const userModel = require("../models/userModel");

const loginCon = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      Login,
      err,
    });
  }
};

const registerCon = async (req, res) => {
  try {
    // Check if user with the same email already exists
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create new user
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (err) {
    // Handle any errors
    res.status(400).json({
      success: false,
      err,
    });
  }
};

module.exports = registerCon;

module.exports = { loginCon, registerCon };
