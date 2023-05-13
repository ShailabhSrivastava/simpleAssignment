const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const {
  isValidEmail,
  isValidName,
  isValidPhone
} = require("../validators/validation");
const jwt = require("jsonwebtoken");

//============================================CREATE USER ============================================

const createUser = async function (req, res) {
  try {
    let data = req.body;
    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "please give some data" });

    const { fname, lname, email, phone, password } = data; //Destructuring

    if (!fname)
      return res
        .status(400)
        .send({ status: false, message: "fname is mandatory" });
    if (!isValidName(fname))
      return res
        .status(400)
        .send({ status: false, message: "fname is invalid" });

    if (!lname)
      return res
        .status(400)
        .send({ status: false, message: "lname is mandatory" });
    if (!isValidName(lname))
      return res
        .status(400)
        .send({ status: false, message: "lname is invalid" });

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "email is mandatory" });
    if (!isValidEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "email is invalid" });
    let emailExist = await userModel.findOne({ email });
    if (emailExist)
      return res.status(400).send({
        status: false,
        message: "user with this email already exists",
      });

    if (!phone)
      return res
        .status(400)
        .send({ status: false, message: "phone is mandatory" });
    if (!isValidPhone(phone))
      return res
        .status(400)
        .send({ status: false, message: "phone is invalid" });
    let phoneExist = await userModel.findOne({ phone });
    if (phoneExist)
      return res.status(400).send({
        status: false,
        message: "user with this phone number already exists",
      });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory" });

    let salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    const user = await userModel.create(data);
    return res.status(201).send({
      status: true,
      message: "user is successfully created",
      data: user,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//===================================LOGIN==========================================
const userLogin = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter data" });

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Please enter email" });

    if (!isValidEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid email" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Please enter password" });

    const Login = await userModel.findOne({ email });
    if (!Login)
      return res
        .status(404)
        .send({ status: false, message: "Not a register email Id" });

    let decodePwd = await bcrypt.compare(password, Login.password);
    if (!decodePwd)
      return res
        .status(400)
        .send({ status: false, message: "Password not match" });

    let token = jwt.sign(
      {
        userId: Login._id.toString(),
      },
      "As calm as the sea",
      { expiresIn: "50d" }
    );

    return res.status(200).send({
      status: true,
      message: "User login successfull",
      data: { userId: Login._id, token: token },
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createUser,
  userLogin,
};
