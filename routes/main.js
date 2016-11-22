(function () {
  'use strict';

  let express = require('express');
  let router = express.Router();

  router.get('/', function (request, response, next) {
    response.status(200).send('Everything is fine Dude. JellyPizzaHack is coming!!! C: C: C:');
    next();
  });

  module.exports = router;
})();
