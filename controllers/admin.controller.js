const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminSchema = require("../models/admin.model");

const admin = mongoose.model("admins", adminSchema);

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).send({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminMade = await admin.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: adminMade._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5h",
    });

    res.status(200).send({
      message: "Admin created succesfully",
      data: token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Create Admin failed",
    });
  }
};

const getAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // const hashedPassword = bcrypt.hash(password, 10);

    const adminFound = await admin.findOne({ email });

    if (!adminFound) {
      res.status(400).send({
        message: "Email is invalid",
      });

      return;
    }

    const compare = await bcrypt.compare(password, adminFound.password);

    if (!compare) {
      res.status(400).send({
        message: "Password is invalid",
      });

      return;
    }

    const token = jwt.sign({ id: adminFound._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5h",
    });

    let today = new Date();

    await admin.updateOne({ _id: adminFound._id }, { lastLogin: new Date() });

    // let updatelastLogin = await adminFound.updateOne({email}, {
    //     lastLogin:today
    // })

    res.status(200).send({
      message: "Admin logged in succesfully",
      data: {
        token,
        lastLogin: adminFound.lastLogin,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Login Admin failed",
    });
  }
};

const getAdminData = async (req, res) => {
  try {
    const adminId = req.admin;

    const { id } = adminId;

    // const hashedPassword = bcrypt.hash(password, 10);

    const adminFound = await admin.findById(id);

    if (!adminFound) {
      res.status(400).send({
        message: "Admin does not exist",
      });

      return;
    }

    res.status(200).send({
      message: "Admin found succesfully",
      data: {
        token,
        name: adminFound.name,
        email: adminFound.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Admin not found",
    });
  }
};

module.exports = { createAdmin, getAdmin, getAdminData };
