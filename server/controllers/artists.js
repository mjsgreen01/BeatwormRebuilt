const Artists = require('../models').Artists;

module.exports = {
  create(req, res) {
    return Artists
      .create({
        name: req.body.name,
      })
      .then(artist => res.status(201).send(artist))
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    console.log("list function activated");
    return Artists
      .findAll({
        attributes: ['*']
      })
      .then(artists => res.status(201).send(artists))
      .catch(err => res.status(400).send(err))
  }
};
