const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/is-admin");
const isStudent = require("../../middleware/is-student");
const isSuperAdmin = require("../../middleware/super.admin");
const upload = require("../../middleware/uploads");
const { create, updateForAdmin, remove, getById, getAllForAdmin, getByIdForStudent } = require("../controller/result");

const router = require("express").Router();

router.post("/result", auth, isStudent, upload, create);
router.get("/result/student", auth, isStudent, getByIdForStudent);
router.put("/result/:_id", auth, isAdmin, updateForAdmin);
router.delete("/result/:_id", auth, isAdmin, isSuperAdmin, remove);
router.get("/result/all/:_id", auth, isAdmin, isSuperAdmin, getAllForAdmin);
router.get("/result/:_id", auth, isAdmin, isSuperAdmin, getById);




module.exports = router;