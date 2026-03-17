const mongoose = require("mongoose");
const studentSchema = require("../models/student.model");
const { escapeRegex } = require("../jsFunc/jsFUnc");
const { paymentsDB } = require("./payment.controller");

const studentDB = mongoose.model("students", studentSchema);

const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      parentName,
      studentClass,
      totalFees,
    } = req.body;

    const { id } = req.admin;

    // let fullMadeName = `${firstName} ${middleName} ${lastName}`;

    if (totalFees === undefined) {
      res.status(400).send({
        message: "Student Creation Failed bcuz totalFees is not specified",
      });
      return;
    }

    const student = await studentDB.create({
      firstName,
      middleName,
      lastName,
      parentName,
      studentClass,
      createdBy: id,
    });

    // await student.populate("createdBy");

    const payment = await paymentsDB.create({
      student: student._id,
      totalFees: totalFees,
      createdBy: id,
    });

    res.status(200).send({
      message: "Student Creation Successful",
      data: {
        student,
        payment,
        id,
      },
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: "Student Creation Failed" + error,
    });
  }
};

const filterByName = async (req, res) => {
  try {
    // const { fullName } = req.body;
    const { search } = req.query;
    const { id } = req.admin;

    const safeSearch = escapeRegex(search);

    const student = await studentDB
      .find({
        fullName: {
          $regex: safeSearch,
          $options: "i",
        },
        createdBy: id,
        isDeleted: false,
      })
      .populate("createdBy");

    // student.pop

    res.status(200).send({
      message: "Student has been found",
      data: student,
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: "Student wasn't found",
    });
  }
};

const filterByClass = async (req, res) => {
  try {
    const { studentClass } = req.body;
    const { id } = req.admin;

    const student = await studentDB
      .find({
        studentClass,
        createdBy: id,
        isDeleted: false,
      })
      .populate("createdBy");

    res.status(200).send({
      message: "Student has been found",
      data: student,
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: "Student wasn't found",
    });
  }
};

const softDelete = async (req, res) => {
  try {
    const { _id } = req.params;
    // const {id} = req.admin

    const student = await studentDB.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    // student.isDeleted = true

    res.status(200).send({
      message: "Student has been soft deleted",
      data: student,
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: "Student wasn't softly deleted",
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { _id } = req.params;
    // const {id} = req.admin

    const student = await studentDB.findByIdAndDelete({ _id });

    res.status(200).send({
      message: "Student has been deleted",
      data: student,
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: "Student wasn't deleted",
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { _id } = req.params;

    // const { firstName, lastName, middleName } = req.body;
    const updateData = { ...req.body };

    // const studentName = await studentDB.findById(_id);

    // if (!studentName) {
    //   res.status(400).send({
    //     message: "Student fullname naaa",
    //     data: student,
    //   });
    // }

    // if (firstName || middleName || lastName) {
    //   updateData.fullName =
    //     `${firstName || studentName.firstName} ${middleName || studentName.middleName} ${lastName || studentName.lastName}`.trim();
    // }

    const student = await studentDB.findByIdAndUpdate(_id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    await student.save();

    res.status(200).send({
      message: "Student has been updated",
      data: {
        before: studentName,
        after: student,
      },
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: "Student wasn't updated",
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { id } = req.admin;

    const { page, limit } = req.query;

    const pageNo = Number(page) || 1;
    const limitNo = Number(limit) || 10;

    const skip = (pageNo - 1) * limitNo;

    const students = await studentDB
      .find({ createdBy: id, isDeleted: false })
      .skip(skip)
      .limit(limitNo)
      .sort({ createdAt: -1 });

    const number = students.length;

    const totalPages = Math.ceil(number / limitNo);

    res.status(200).send({
      message: "Students have been found",
      data: {
        total: number,
        totalPages,
        students,
      },
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: "Student have not been found",
    });
  }
};

const getOneStudent = async (req, res) => {
  try {
    const { _id } = req.params;
    const { id } = req.admin;

    const student = await studentDB.find({
      _id,
      createdBy: id,
      isDeleted: false,
    });

    if (!student) {
      res.status(400).send({
        message: "Student id does not exist",
      });
      return;
    }

    res.status(200).send({
      message: "Student found",
      data: student,
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: "Student not found",
    });
  }
};

const updateClass = async (req, res) => {
  try {
    const { _id } = req.params;

    const updateData = { ...req.body };

    if (Object.keys(req.body).length === 0) {
      res.status(200).send({
        message: "No data provided to update",
      });
      return;
    }

    const student = await studentDB.findByIdAndUpdate(
      _id,
      { studentClass: req.body.studentClass },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    const { firstName, studentClass } = student;

    res.status(200).send({
      message: "Class updated successfully",
      data: {
        firstName,
        studentClass,
      },
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: error + "Student wasn't updated",
    });
  }
};

module.exports = {
  createStudent,
  filterByClass,
  filterByName,
  deleteStudent,
  softDelete,
  getAllStudents,
  getOneStudent,
  updateStudent,
  updateClass,
};
