(function () {
  'use strict';

  let Participant = require('persistence/models/participantEntity');

  class ParticipantRepository {

    findParticipantById(uuid) {
      return new Promise((resolve, reject) => {
        Participant.findOne({uuid: uuid}, (err, result) => {
          if (err)
            return reject(err);
          resolve(result);
        });
      });
    }

    findParticipantByEmail(email) {
      return new Promise((resolve, reject) => {
        Participant.findOne({email: email}, (err, result) => {
          if (err)
            return reject(err);
          resolve(result);
        });
      });
    }

    findParticipantByEmailArray(emailArray) {
      return new Promise((resolve, reject) => {
        Participant.find({$or: emailArray}, (err, result) => {
          if (err)
            return reject(err);
          resolve(result);
        });
      });
    }

    deleteParticipantById(uuid) {
      return new Promise((resolve, reject) => {
          Participant.remove({uuid: uuid}, (err, result) => {
            if (err)
              return reject(err);
            resolve(result);
          });
      });
    }

    deleteTeamReferences(teamName) {
      return new Promise((resolve, reject) => {
        Participant.update({team: teamName}, {$unset: {team: 1}}, {multi: true}, (err, result) => {
          if(err)
            return reject(err);
          resolve(result);
        });
      });
    }

    deleteTeamReference(email) {
      return new Promise((resolve, reject) => {
        Participant.update({email: email}, {$unset: {team: 1}}, (err, result) => {
          if(err)
            return reject(err);
          resolve(result);
        });
      });
    }
  }

  module.exports = ParticipantRepository;
})();