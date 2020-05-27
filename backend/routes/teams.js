const express = require('express');

const TeamsController = require('../Controllers/teams')

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// Creating a new Team
router.post("", checkAuth, TeamsController.createTeams);

// Updating a team
router.put("/:id", checkAuth, TeamsController.updateTeam);

// Getting all teams around user's location
router.get('', TeamsController.getTeams);

// Getting a single Team
router.get("/:id", TeamsController.getTeam );
 // Deleting teams
router.delete("/:id", checkAuth, TeamsController.deleteTeam);

module.exports = router;
