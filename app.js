(function () {
  'use strict';

  require('app-module-path').addPath(__dirname);

  let express = require('express');
  let bodyParser = require('body-parser');
  let mongoose = require('mongoose');
  let logger = require('logger');

  let app = express();

  mongoose.connect('156.17.43.89:27017/jellypizzahack');

  let main = require('routes/main');
  let participants = require('routes/participants');
  let teams = require('routes/teams');

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  let port = process.env.PORT || 49152;

  app.use('/', main);
  app.use('/participant', participants);
  app.use('/team', teams);

  app.listen(port);
  logger.info(`Listening on port ${port}`);
})();
