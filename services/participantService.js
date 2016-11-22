(function () {
  'use strict';

  let Participant = require('persistence/models/participantEntity');
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
      Promise
        .resolve(ParticipantRepository.deleteParticipantById(participantId))
        .then((res) => {
          resolve(res)
        }, (err) => {
          reject(err)
        });
    }
  }

  module.exports = ParticipantService;
})();