const express = require("express");
const users = require("../controllers/user.controller");

const router = express.Router();

router.route("/")
    .get(users.findAll)
router.route("/register")
    .post(users.register)
router.route("/login")
    .post(users.logIn)
router.route("/:id")
    .get(users.findOne)
    .put(users.update)
    .delete(users.delete)
router.route("/logout/:id")
    .post(users.logOut)

module.exports = router;