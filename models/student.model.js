const mongoose = require("mongoose");

// let classes = ["Primary 1", "Primary 2"]

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    middleName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
    },

    parentName: {
      type: String,
      required: true,
    },

    studentClass: {
      type: String,
      enum: ["Primary 1", "Primary 2"],
      required: true,
    },

    // payment:{
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref:"payments",
    //     // required:true,  come back to this later
    //     unique:true
    // },

    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "admins",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strict: true },
);

studentSchema.pre("save", function () {
  this.fullName = `${this.firstName} ${this.middleName} ${this.lastName}`;
});

studentSchema.index(
  { firstName: 1, lastName: 1, createdBy: 1 },
  { unique: true },
);

// studentSchema.post("save", async function (doc, next) {
//   if (!doc.isNew) return next();

//   try {
//     const { paymentsDB } = require("../controllers/payment.controller");

//     await paymentsDB.create({
//       student: doc._id,
//       totalFees: 50000,
//       createdBy: doc.createdBy,
//     });

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = studentSchema;
