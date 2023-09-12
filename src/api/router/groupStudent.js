
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/is-admin");
const isStudent = require("../../middleware/is-student");
const isSuperAdmin = require("../../middleware/super.admin");
const { create, remove, getAllForAdmin, getAllForStudent } = require("../controller/group.students");

const router = require("express").Router();

router.post("/groups/student", auth, isAdmin, isSuperAdmin, create);
router.delete("/groups/student/:_id", auth, isAdmin, isSuperAdmin, remove);
router.get("/groups/student", auth, isAdmin, isSuperAdmin, getAllForAdmin);
router.get("/groups/student/:_id", auth, isStudent, getAllForStudent);




module.exports = router;