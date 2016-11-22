(function () {
  'use strict';

  let Participant = require('persistence/models/participantEntity');
  let TeamRepository = require('persistence/teamRepository');
  let ParticipantRepository = require('persistence/participantRepository');
  let uuid = require('uuid');

  class ParticipantService {

    static saveParticipant(participant, teamName) {
      ParticipantService.makeParticipant(participant, teamName).save();
    }

    static makeParticipant(member, teamName) {
      let participant = new Participant();
      participant.uuid = uuid.v4();
      participant.name = member.name;
      participant.surname = member.surname;
      participant.email = member.email;
      participant.team = teamName;
      return participant;
    }

    static deleteParticipant(participantId) {
      return new Promise((resolve, reject) => {
        Promise
          .all([ParticipantService.deleteParticipantFromDatabase(participantId), ParticipantService.cleanupAfterDelete(participantId)])
          .then((res) => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
    }

    static deleteParticipantFromDatabase(participantId) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(ParticipantRepository.deleteParticipantById(participantId))
          .then((res) => {
            resolve(res)
          }, (err) => {
            reject(err)
          });
      });
    }

    static cleanupAfterDelete(participantId) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(TeamRepository.deleteParticipantReferences(participantId))
          .then((res) => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
    }
  }

  module.exports = ParticipantService;
})();