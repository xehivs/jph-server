(function () {
  'use strict';

  let mongoose = require('mongoose');
  let Schema = mongoose.Schema;

  let TeamSchema = new Schema({
    uuid: String,
    name: String,
    members: [String]
  });

  module.exports = mongoose.model('Team', TeamSchema);
})();
