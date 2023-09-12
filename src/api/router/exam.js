const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/is-admin");
const upload = require("../../middleware/uploads");
const { create, update, remove, getById, getAllForAdmin } = require("../controller/exam");

const router = require("express").Router();

router.post("/exam", auth, isAdmin, upload, create);
router.put("/exam/:_id", auth, isAdmin, upload, update);
router.delete("/exam/:_id", auth, isAdmin, remove);
router.get("/exam/all/:_id", auth, isAdmin, getAllForAdmin);
router.get("/exam/:_id", getById);


module.exports = router;