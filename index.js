const express = require("express");
const cors = require("cors")
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

const dotenv = require("dotenv");
const { connectMyDB } = require("./config/db.connect");

dotenv.config();

// const PORT = process.env.PORT

// app.listen(PORT, (err) => {
//     if(err) {
//         console.log(err.cause, err.message)
//     } else {
//         console.log(`Server started successfully at ${PORT}`)
//     }
// })

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Error ${err}`);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});

connectMyDB();

const StudentRouter = require("./routers/student.router");
const PaymentRouter = require("./routers/payment.router");
const AdminRouter = require("./routers/admin.router");

app.use("/api/v2", StudentRouter);
app.use("/api/v2", PaymentRouter);
app.use("/api/v2", AdminRouter);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
// const obj =  {
//   we:"i",
//   i:"we"
// }

// obj.push = "Yes"

// console.log(obj)
