const artistsController = require('../controllers').artists;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the beatworm API',
  }));


  app.get('/api/artists', artistsController.list)
  app.post('/api/artists', artistsController.create)
};
