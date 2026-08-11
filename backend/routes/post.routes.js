const router = require("express").Router();

const { activeCheck } = require("../controllers/post.controllers");

router.route("/").get(activeCheck);

module.exports = router;
