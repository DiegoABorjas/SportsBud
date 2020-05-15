const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require("../models/users")

const router = express.Router();

// Register users
router.post("/register", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const users = new Users({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    users.save()
    .then(result => {
      res.status(201).json({
        message: 'User created!',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Invalid authentication credentials!"
      });
    });
  });
});

//Login users
router.post("/login", (req, res, next) => {
  let fetchedUser;
  Users.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
      "secret_this_should_be_a_very_long_string",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: "Invalid authentication credentials!"
    })
  })
});

module.exports = router;
