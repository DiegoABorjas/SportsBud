const express = require('express');

const Teams = require('../models/teams');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// Creating a new Team
router.post("", checkAuth, (req, res, next) => {
  const teams = new Teams({
    name: req.body.name,
    description: req.body.description,
    creator: req.userData.userId
  });
  teams.save().then(createdTeams => {
    res.status(201).json({
      message: 'Team added successfully',
      teams: {
        ...createdTeams,
        id: createdTeams._id
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a team failed!"
    })
  });
});

// Updating a team
router.put("/:id", checkAuth, (req, res, next) => {
  const team = new Teams({
    _id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    creator: req.userData.userId
  })
  Teams.updateOne({_id: req.params.id, creator: req.userData.userId }, team).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({message: 'Update successful!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Could not update team!"
    });
  });
});

// Getting all teams
router.get('', (req, res, next) => {
  Teams.find().then(documents => {
    res.status(200).json({
      message: 'Teams fetched successfully!',
      teams: documents
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching teams failed!"
    });
  });
});

// Getting a single Team
router.get("/:id", (req, res, next) => {
  Teams.findById(req.params.id).then(team => {
    if (team) {
      res.status(200).json(team);
    } else {
      return status(404).json({message: 'Team not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching team failed!"
    });
  });
});
 // Deleting teams
router.delete("/:id", checkAuth, (req, res, next) => {
  Teams.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: 'Team deleted!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching teams failed!"
    });
  });
});

module.exports = router;
