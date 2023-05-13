const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authentication, isUserAuthorised } = require("../middleware/auth");

router.post("/users", userController.createUser);
router.post("/login", userController.userLogin);

module.exports = router;