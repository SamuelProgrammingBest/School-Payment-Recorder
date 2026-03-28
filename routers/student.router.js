const express = require("express")
const { createStudent, filterByName, filterByClass, deleteStudent, getAllStudents, getOneStudent, updateStudent, updateClass, softDelete } = require("../controllers/student.controller")
const { verifyAdmin } = require("../middleware/protect")

const router = express.Router()

router.post("/createStudent", verifyAdmin,  createStudent)
router.get("/getStudents", verifyAdmin, getAllStudents)
router.get("/getStudent/:_id", verifyAdmin, getOneStudent)
router.post("/filterStudents", verifyAdmin, filterByName)
router.get("/filterClass", verifyAdmin, filterByClass)
router.get("/filterName", verifyAdmin, filterByName)
router.delete("/deleteStudent/:_id", verifyAdmin,softDelete)
router.put("/updateStudent/:_id", verifyAdmin, updateStudent)
router.put("/updateClass/:_id", verifyAdmin, updateClass)

module.exports = router