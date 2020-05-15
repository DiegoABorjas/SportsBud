const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Routes
const usersRoutes = require("./routes/users");
const teamsRoutes = require("./routes/teams");

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sportsBud')
.then(() => {
  console.log('Connected to database!')
})
.catch(() => {
  console.log('Connection failed!');
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use("/api/users", usersRoutes);
app.use("/api/teams", teamsRoutes);

module.exports = app;
