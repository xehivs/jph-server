(function () {
  'use strict';

  let Team = require('persistence/models/teamEntity');

  class TeamRepository {

    static findTeamById(uuid) {
      return new Promise((resolve, reject) => {
        Team.findOne({uuid: uuid}, (err, result) => {
          if (err)
            return reject(err);
          resolve(result);
        });
      });
    }

    static findTeamByName(name) {
      return new Promise((resolve, reject) => {
        Team.find({name: name}, (err, result) => {
          if(err)
            return reject(err);
          resolve(result);
        });
      });
    }
  }

  module.exports = TeamRepository;
})();