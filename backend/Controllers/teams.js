const Teams = require('../models/teams');

// Creating a new Team
exports.createTeams = (req, res, next) => {
  const teams = new Teams({
    name: req.body.name,
    description: req.body.description,
    sport: req.body.sport,
    location : req.body.location,
    contact: req.body.contact,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    geometry: {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude],
      index: '2dsphere'
    },
    isActive: req.body.isActive,
    creator: req.userData.userId
  });
  console.log(req.body.isActive)
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
}

// Updating a team
exports.updateTeam = (req, res, next) => {
  const team = new Teams({
    _id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    sport: req.body.sport,
    location: req.body.location,
    contact: req.body.contact,
    isActive: req.body.isActive,
    creator: req.userData.userId
  })
  Teams.updateOne({_id: req.params.id, creator: req.userData.userId }, team).then(result => {
    if (result.n > 0) {
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
}

// Getting all teams around user's location
exports.getTeams = (req, res, next) => {
  console.log("Searching within " + req.query.mil + " miles")
  Teams.find({
    geometry: {
       $nearSphere: {
          $geometry: {
             type : "Point",
             coordinates : [ parseFloat(req.query.lng), parseFloat(req.query.lat) ]
          },
          // $minDistance: 1000, could use if wanted in the future.

          // Max Distance uses meters 1609m is 1 mile.
          $maxDistance: parseFloat(req.query.mil) * 1609
       }
    }
  }).then(documents => {
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
};

// Getting a single Team
exports.getTeam = (req, res, next) => {
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
};

 // Deleting teams
exports.deleteTeam = (req, res, next) => {
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
};
