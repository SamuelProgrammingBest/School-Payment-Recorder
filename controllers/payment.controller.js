const mongoose = require("mongoose");
const paymentSchema = require("../models/payment.model");

const paymentsDB = mongoose.model("payments", paymentSchema);

const populatePayment = async (req, res) => {
  try {
    const { studentId } = req.params;

    const payment = await paymentsDB
      .findOne({ student: studentId })
      .populate("student");

    // payment.populate("student");

    res.status(200).send({
      message: "Payment populated successfully",
      data: payment,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: error + "" + "Payment not populated",
    });
  }
};

const createPayment = async (req, res) => {
  try {
    // const { feesPaid, totalFees } = req.body;

    // let status;

    // if (feesPaid === 0) {
    //   status = "Unpaid";
    // } else if (feesPaid > 0 && feesPaid < totalFees) {
    //   status = "Partial";
    // } else {
    //   status = "Paid";
    // }

    const { id } = req.admin;

    const payment = await paymentsDB.create({ ...req.body, createdBy: id });

    res.status(200).send({
      message: "Payment Creation Successful",
      data: payment,
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: error + "" + "Payment Creation Failed",
    });
  }
};

const getPayment = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { id } = req.admin;

    const payment = await paymentsDB
      .findOne({ student: studentId, createdBy: id })
      .populate("student");

    if (!payment) {
      return res.status(404).send({
        message: "Payment not found",
      });
    }

    res.status(200).send({
      message: "Gotten Payment",
      data: {
        student: payment.student,
        payment: payment,
        // studentName: payment.student.fullName,
        totalFees: payment.totalFees,
        feesPaid: payment.feesPaid,
        balance: payment.balance,
        status: payment.status,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "Payment and student not gotten",
    });
  }
};

const getDashboard = async (req, res) => {
  try {
    // const { studentId } = req.params;
    const { id } = req.admin;

    // const payment = await paymentsDB
    //   .find({ createdBy: id })
    //   .populate("student");

    const countPayment = await paymentsDB.countDocuments({ createdBy: id });

    const countPaid = await paymentsDB.countDocuments({
      createdBy: id,
      status: "Paid",
    });

    const countUnpaid = await paymentsDB.countDocuments({
      createdBy: id,
      status: "Unpaid",
    });

    const countPartial = await paymentsDB
      .countDocuments({ createdBy: id, status: "Partial" })
      .populate("student");

    const payments = await paymentsDB
      .find({ createdBy: id })
      .populate("student");

    if (!payments) {
      return res.status(404).send({
        message: "Student/Payment not found",
      });
    }

    // Fees already paid by student
    const balances = payments.map((payment) => payment.feesPaid);

    const totalFees = balances.reduce((acc, currentValue) => {
      acc + currentValue;
    }, 0);

    // Fees expected to be paid
    const revenue = payments.map((payment) => payment.totalFees);

    const revenueExpected = revenue.reduce((acc, currentValue) => {
      acc + currentValue;
    }, 0);

    // Fees expected to be paid
    const moneyRem = payments.map((payment) => payment.balance);

    const moneyRemSum = unpaid.reduce((acc, currentValue) => {
      acc + currentValue;
    }, 0);

    res.status(200).send({
      message: "Gotten Payment",
      data: {
        totalStudents: countPayment,
        paidStudents: countPaid,
        unpaidStudents: countUnpaid,
        partialStudents: countPartial,
        totalFeesCollected: totalFees,
        totalRevenueExpected: revenueExpected,
        totalRevenueRemaining:moneyRemSum
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "Payment and student not gotten",
    });
  }
};

const payAmount = async (req, res) => {
  try {
    const { studentId } = req.params;
    // const _id = studentId

    const updateFeesPaid = req.body.feesPaid;

    const findPayment = await paymentsDB.findOne({
      student: studentId,
      createdBy: id,
    });
    let { feesPaid } = findPayment;

    feesPaid += updateFeesPaid;

    await findPayment.save();

    // const payment = await paymentsDB.findOneAndUpdate(
    //   { student: studentId },
    //   { feesPaid: feesPaid + updateFeesPaid },
    //   {
    //     returnDocument: "after",
    //     runValidators: true,
    //   },
    // );

    // await payment.save();

    res.status(200).send({
      message: "Gotten Payment",
      data: findPayment,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: error + " " + "Payment and student not gotten",
    });
  }
};

const countStudents = async (req, res) => {
  try {
    const findStudents = await paymentsDB.countDocuments();

    const findPaid = await paymentsDB.countDocuments({ status: "Paid" });

    const findPartialPaid = await paymentsDB.countDocuments({
      status: "Partial",
    });

    const findUnpaid = await paymentsDB.countDocuments({ status: "Unpaid" });

    res.status(200).send({
      message: "Gotten Payment",
      data: {
        totalStudents: findStudents,
        paidStudents: findPaid,
        partialStudents: findPartialPaid,
        unpaidStudents: findUnpaid,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: error + " " + "Payment and student not gotten",
    });
  }
};

const countDefaulters = async (req, res) => {
  try {
    const findStudents = await paymentsDB
      .find({
        status: "Partial",
        status: "Unpaid",
      })
      .populate("student");

    res.status(200).send({
      message: "Gotten Defaulters",
      results: findStudents.length,
      data: findStudents,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: error + " " + "Payment and student not gotten",
    });
  }
};

const filterClassPayment = async (req, res) => {
  try {
    const { studentClass } = req.params;
    const { id } = req.admin;

    const findClass = await paymentsDB.find({ createdBy: id }).populate({
      path: "student",
      match: { studentClass },
    });

    const notNull = findClass.filter((student) => student != null);

    const paid = notNull.filter((p) => p.status === "Paid").length;
    const partial = notNull.filter((p) => p.status === "Partial").length;
    const unpaid = notNull.filter((u) => u.status === "Unpaid").length;

    res.status(200).send({
      message: "Filtered by class for payment",
      results: notNull.length,
      data: {
        class: studentClass,
        notNull,
        paid,
        partial,
        unpaid,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: error + " " + "Payment and student not gotten",
    });
  }
};

module.exports = {
  populatePayment,
  createPayment,
  getPayment,
  payAmount,
  countStudents,
  countDefaulters,
  filterClassPayment,
  getDashboard,
  paymentsDB,
};
