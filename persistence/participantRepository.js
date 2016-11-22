(function () {
  'use strict';

  let Participant = require('persistence/models/participantEntity');

  class ParticipantRepository {

    static findParticipantById(uuid) {
      return new Promise((resolve, reject) => {
        Participant.findOne({uuid: uuid}, (err, result) => {
          if (err)
            return reject(err);
          resolve(result);
        });
      });
    }

    static findParticipantByEmail(email) {
      return new Promise((resolve, reject) => {
        Participant.findOne({email: email}, (err, result) => {
          if (err)
            return reject(err);
          resolve(result);
        });
      });
    }

    static findParticipantByEmailArray(emailArray) {
      return new Promise((resolve, reject) => {
        Participant.find({$or: emailArray}, (err, result) => {
          if (err)
            return reject(err);
          resolve(result);
        });
      });
    }

    static deleteParticipantById(uuid) {
      return new Promise((resolve, reject) => {
          Participant.remove({uuid: uuid}, (err, result) => {
            if (err)
              return reject(err);
            resolve(result);
          });
      });
    }
  }

  module.exports = ParticipantRepository;
})();