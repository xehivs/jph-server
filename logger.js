(function () {
  'use strict';

  let winston = require('winston');

  module.exports = new winston.Logger({
    transports: [
      new winston.transports.Console({
        prettyPrint: true,
        handleExceptions: true,
        json: false,
        colorize: true
      })
    ],
    exitOnError: false
  });

})();