const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/is-admin");
const isSuperAdmin = require("../../middleware/super.admin");
const upload = require("../../middleware/uploads");
const { create, update, remove, getById, getAllForAdmin, login } = require("../controller/student");

const router = require("express").Router();

router.post("/student", auth, isAdmin, isSuperAdmin, upload, create);
router.put("/student/:_id", auth, isAdmin, isSuperAdmin, upload, update);
router.delete("/student/:_id", auth, isAdmin, isSuperAdmin, remove);
router.get("/student", auth, isAdmin, isSuperAdmin, getAllForAdmin);
router.get("/student/:_id", auth, isAdmin, isSuperAdmin, getById);
router.post("/student/login", login);



module.exports = router;