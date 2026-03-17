const mongoose = require("mongoose")

// let classes = ["Primary 1", "Primary 2"]

const paymentSchema = new mongoose.Schema({
    student:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"students",
        required:true,
        unique:true
    },

    totalFees:{
        type:Number,
        required:true,
    },

    feesPaid:{
        type:Number,
        default:0
    },

    balance:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        enum:["Paid", "Partial", "Unpaid"],
        default:"Unpaid"
    },

    createdBy:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"admins",
        required:true
    }

}, {timestamps:true, strict:true})


paymentSchema.pre('save', function() {
  // 'this' is the document about to be saved
  this.balance = this.totalFees - this.feesPaid

  if (this.feesPaid === 0) {
      this.status = "Unpaid";
    } else if (this.feesPaid > 0 && this.feesPaid < this.totalFees) {
      this.status = "Partial";
    } else {
      this.status = "Paid";
    }
  // Call next() if the hook is synchronous or when the async operation finishes
//   next(); 
});


module.exports = paymentSchema