const userModel = require('../models/userModel');
const sellerModel = require('../models/sellerModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// For registering new user
const userRegister = async (req, res) => {
    const user = req.body;
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    try {
      await userModel.createUser(user.number, hashedPassword, user.photo, user.email, user.name, user.birthdate, 0, user.address_number, user.address_street, user.address_village, user.address_subdistrict, user.address_city, user.address_province, user.address_code);
      const responseData = await userModel.getCredentials(user.number);
      return res.status(201).json({ 
        message: 'Register success',
        data: responseData[0]
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Register failed'
      });
    }

};

const userLogin = async (req, res) => {
  const credentials = await userModel.getCredentials(req.body.number);
  const resData = credentials[0].find((item) => item.number == req.body.number)
  const password = req.body.password
  if (resData === undefined) {
    return res.status(404).json({
      message: 'Number unregistered',
    });
  }

  const isPasswordMatch = bcrypt.compareSync(password, resData.password);
  if (isPasswordMatch) {
    const user = { number: req.body.number };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    res.status(200).json({
      message: 'Login success',
      accessToken: accessToken
    })
  } else {
    return res.status(401).json({
      message: 'Login failed',
    });
  }
};

module.exports = {
  userRegister,
  userLogin
}