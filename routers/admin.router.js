const express = require("express")
const { createAdmin, getAdmin, getAdminData } = require("../controllers/admin.controller")
const { verifyAdmin } = require("../middleware/protect")


const router = express.Router()


router.post("/signUp", createAdmin)
router.post("/login", getAdmin)
router.get("/admin/me", verifyAdmin, getAdminData)

module.exports = router
