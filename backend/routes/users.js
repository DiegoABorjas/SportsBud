const express = require('express');
const bcrypt = require('bcrypt');

const Users = require("../models/users")

const router = express.Router();

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
        error: err
      });
    });
  });
});




module.exports = router;
