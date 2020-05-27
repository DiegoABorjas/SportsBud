const express = require('express');

const UserController = require("../Controllers/user")


const router = express.Router();

// Register users
router.post("/register", UserController.createUser);

//Login users
router.post("/login", UserController.userLogin);

module.exports = router;
