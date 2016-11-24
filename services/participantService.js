(function () {
  'use strict';

  let Participant = require('persistence/models/participantEntity');
  let ParticipantValidator = require('validators/participantValidator');
  let TeamRepository = require('persistence/teamRepository');
  let ParticipantRepository = require('persistence/participantRepository');
  let uuid = require('uuid');

  class ParticipantService {

    constructor() {
      this.participantRepository = new ParticipantRepository();
      this.teamRepository = new TeamRepository();
      this.participantValidator = new ParticipantValidator();
    }

    changeTeam(participantId, teamId) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.teamRepository.findTeamById(teamId))
          .then((res) => {
            Promise
              .resolve(this.changeTeamAfterGotTeam(participantId, res))
              .then((res) => {
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              })
          })
          .catch((err) => {
            reject(err);
          })
      });
    }

    changeTeamAfterGotTeam(participantId, team) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.teamRepository.deleteParticipantReferences(participantId))
          .then(() => {
            Promise
              .resolve(this._changeCurrentTeam(participantId, team))
              .then((res) => {
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      });
    }

    _changeCurrentTeam(participantId, team) {
      return new Promise((resolve, reject) => {
        Promise
          .all([
            this.participantRepository.changeTeam(participantId, team.name),
            this.teamRepository.pushNewParticipant(team.uuid, participantId)
          ]).then((res) => {
            resolve(res);
          }).catch((err) => {
            reject(err);
          });
      });
    }

    validateData(participant) {
      return new Promise((resolve, reject) => {
        Promise.all([
          this.participantValidator.isRequestDataOk(participant),
          this.participantValidator.isDateCorrect(participant.birth_date),
          this.participantValidator.isNotTooOld(participant.birth_date),
          this.participantValidator.isEmailValid(participant.email),
          this.participantValidator.isEmailAvailable(participant.email)
        ]).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    }

    getValidatedParticipant(participantId) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.participantValidator.checkCredentials(participantId))
          .then((res) => {
            resolve(res);
          }, (err) => {
            reject(err);
          })
      });
    }

    saveParticipant(participant, teamName) {
      this.makeParticipant(participant, teamName).save();
    }

    makeParticipant(member, teamName) {
      let participant = new Participant();
      participant.uuid = uuid.v4();
      participant.name = member.name;
      participant.surname = member.surname;
      participant.email = member.email;
      participant.team = teamName;
      return participant;
    }

    deleteParticipant(participantId) {
      return new Promise((resolve, reject) => {
        Promise
          .all([this.deleteParticipantFromDatabase(participantId), this.cleanUpAfterDelete(participantId)])
          .then((res) => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
    }

    deleteParticipantFromDatabase(participantId) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.participantRepository.deleteParticipantById(participantId))
          .then((res) => {
            resolve(res)
          }, (err) => {
            reject(err)
          });
      });
    }

    cleanUpAfterDelete(participantId) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.teamRepository.deleteParticipantReferences(participantId))
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