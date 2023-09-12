const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/is-admin");
const isSuperAdmin = require("../../middleware/super.admin");
const { create, update, remove, getById, getAll, login } = require("../controller/admin");

const router = require("express").Router();

router.post("/admin", auth, isAdmin, isSuperAdmin, create);
router.post("/admin/login", login);
router.put("/admin/:_id", auth, isAdmin, update);
router.delete("/admin/:_id", auth, isAdmin, isSuperAdmin, remove);
router.get("/admin", auth, isAdmin, isSuperAdmin, getAll);
router.get("/admin/:_id", getById);


module.exports = router;