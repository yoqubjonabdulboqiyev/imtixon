const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/is-admin");
const isSuperAdmin = require("../../middleware/super.admin");
const { create, update, remove, getById, getAllForAdmin } = require("../controller/group");

const router = require("express").Router();

router.post("/group", auth, isAdmin, isSuperAdmin, create);
router.put("/group/:_id", auth, isAdmin, isSuperAdmin, update);
router.delete("/group/:_id", auth, isAdmin, isSuperAdmin, remove);
router.get("/group", auth, isAdmin, isSuperAdmin, getAllForAdmin);
router.get("/group/:_id", auth, isAdmin, isSuperAdmin, getById);



module.exports = router;