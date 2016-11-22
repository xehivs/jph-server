(function () {
  'use strict';

  let mongoose = require('mongoose');
  let Schema = mongoose.Schema;

  let ParticipantSchema = new Schema({
    uuid: String,
    name: String,
    surname: String,
    email: String,
    birth_date: String,
    school: String,
    department: String,
    field_of_study: String,
    album_number: String,
    year: String,
    size: String,
    team: String
  });

  module.exports = mongoose.model('Participant', ParticipantSchema);
})();

