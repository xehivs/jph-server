(function () {
  'use strict';

  let winston = require('winston');

  module.exports = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
        prettyPrint: true,
        handleExceptions: true,
        json: false,
        colorize: true
      })
    ],
    exitOnError: false
  });

})();