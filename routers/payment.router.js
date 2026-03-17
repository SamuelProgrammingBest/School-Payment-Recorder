const express = require("express")
const { populatePayment, createPayment, getPayment, payAmount, countStudents, countDefaulters, filterClassPayment, getDashboard } = require("../controllers/payment.controller")
const { verifyAdmin } = require("../middleware/protect")

const router = express.Router()

router.get("/payPopulate/:studentId", verifyAdmin, populatePayment)
router.post("/createPayment", verifyAdmin, createPayment)
router.get("/getStudentPayment/:studentId", verifyAdmin, getPayment) // For Students Payment and details
router.get("/dashboard", verifyAdmin, getDashboard) // For Students Payment and details
router.post("/payAmount/:studentId/pay", verifyAdmin, payAmount)
router.get("/payments", verifyAdmin, countStudents)
router.get("/payments/defaulters", verifyAdmin, countDefaulters)
router.get("/payments/class/:studentClass", verifyAdmin,filterClassPayment)

module.exports = router