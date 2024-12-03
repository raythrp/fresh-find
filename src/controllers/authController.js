const userModel = require('../models/userModel');
const sellerModel = require('../models/sellerModel');
const helpers = require('../helpers/helpers.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSendOTP = async (req, res) => {
  const { number } = req.body;

  try {
    const exist = await userModel.getUserNumberByNumber(number);
    console.error(exist[0][0]);
    if (exist[0][0] == undefined) {
      const responseData = await helpers.createVerification(number);
      return res.status(200).json({ message: 'Success', data: { status: responseData} });
    } else {
      return res.status(409).json({ message: 'Phone number registered'});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'OTP request fail'});
  }
};

const sellerSendOTP = async (req, res) => {
  const { number } = req.body;

  try {
    const exist = await sellerModel.getSellerNumberByNumber(number);
    if (exist[0][0] == undefined) {
      // const responseData = await helpers.createVerification(number);
      return res.status(200).json({ message: 'Success', data: { status: responseData.status, valid: responseData.valid } });
    } else {
      return res.status(409).json({ message: 'Phone number registered'});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'OTP request fail'});
  }
};

const verifyOTP = async (req, res) => {
  const { number, code } = req.body;

  try {
    const responseData = await helpers.createVerificationCheck(number, code);
    return res.status(200).json({ message: 'Success', data: { status: responseData} })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'OTP check fail'});
  }
}

const forgetPassword = async (req, res) => {
  const { email, userType } = req.body;

  try {
    const user = { email: email, userType: userType };
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    helpers.sendEmail(email, token)
    res.status(200).json({ message: 'Success'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Forget password fail' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    console.log(token);
    res.render('resetPassword', { token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error'});
  }
};

const updatePassword = async (req, res) => {
  const token = req.params.token;
  if (token == null) {
    return res.sendStatus(401);
  } 

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized'});
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { email, userType } = decoded;
    const password = req.body.password;
    hashedPassword = bcrypt.hashSync(password, 10);
    console.log(password) 
    console.log(email) 
    console.log(userType) 
    let updated = false;

    switch (userType){
      case 'user':
        userModel.updatePasswordByEmail(email, hashedPassword);
        updated = true;
        break;
      case 'seller':
        sellerModel.updatePasswordByEmail(email, hashedPassword);
        updated = true;
        break;
      default: res.status(401).json({ message: 'Unauthorized'});
    }

    if (updated == true) {
      return res.render('redirect');
    } else return res.status(500).json({ message: 'Password update fail'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Password update fail'});
  }
}

// For registering new user
const userRegister = async (req, res) => {
    const user = req.body;
    // Password Handling
    let hashedPassword;
    if (!user.password) {
      return res.status(400).json({ message: user });
    }
    try {
      hashedPassword = bcrypt.hashSync(user.password, 10);
    } catch (error) {
      return res.status(500).json({ message: 'Password hashing failed', error: error.message });
    }

    // Insert data to database
    try {
      await userModel.createUser(user.number, hashedPassword, '', user.email, user.name, user.birthdate, 0, user.address_number, user.address_street, user.address_village, user.address_subdistrict, user.address_city, user.address_province, user.address_code);
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

const sellerRegister = async (req, res) => {
  const seller = req.body;
  let hashedPassword;

  // Validasi jika password tidak diisi
  if (!seller.password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // Hashing password
    hashedPassword = bcrypt.hashSync(seller.password, 10);
  } catch (error) {
    return res.status(500).json({ message: 'Password hashing failed' });
  }

  try {
    // Membuat seller baru
    await sellerModel.createSeller(
      seller.number,
      hashedPassword,
      '',
      seller.email,
      seller.store_name,
      seller.birthdate,
      0,
      seller.address_number,
      seller.address_street,
      seller.address_village,
      seller.address_subdistrict,
      seller.address_city,
      seller.address_province,
      seller.address_code,
      seller.bank_account,
      seller.bank_name
    );

    // Mengambil data seller setelah dibuat
    const responseData = await sellerModel.getCredentials(seller.number);
    return res.status(201).json({
      message: 'Seller registration successful',
      data: responseData[0],
    });
  } catch (error) {
    // Memberikan respons hanya dengan message tanpa properti "error"
    return res.status(500).json({
      message: 'Registration failed',
    });
  }
};


const sellerLogin = async (req, res) => {
  const credentials = await sellerModel.getCredentials(req.body.number);
  const resData = credentials[0]?.find((item) => item.number === req.body.number);
  const password = req.body.password;

  if (!resData) {
    return res.status(404).json({ message: 'Seller number not registered' });
  }

  const isPasswordMatch = bcrypt.compareSync(password, resData.password);
  if (isPasswordMatch) {
    const seller = { number: req.body.number };
    const accessToken = jwt.sign(seller, process.env.ACCESS_TOKEN_SECRET);

    res.status(200).json({
      message: 'Seller login successful',
      accessToken: accessToken,
    });
  } else {
    return res.status(401).json({ message: 'Invalid password' });
  }
};

module.exports = {
  userRegister,
  userLogin,
  sellerRegister,
  sellerLogin,
  userSendOTP,
  verifyOTP,
  sellerSendOTP,
  forgetPassword,
  updatePassword,
  resetPassword
};