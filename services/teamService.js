(function () {
  'use strict';

  let uuid = require('uuid');
  let logger = require('logger');

  let Team = require('persistence/models/teamEntity');
  let TeamValidator = require('validators/teamValidator');
  let ParticipantService = require('services/participantService');
  let ParticipantRepository = require('persistence/participantRepository');
  let TeamRepository = require('persistence/teamRepository');

  class TeamService {

    constructor() {
      this.participantRepository = new ParticipantRepository();
      this.teamRepository = new TeamRepository();
      this.teamValidator = new TeamValidator();
      this.participantService = new ParticipantService();
    }

    kickMember(teamId, memberEmail) {
      return new Promise((resolve, reject) => {
        Promise
          .all([
            this._removeTeamPropertyFromParticipant(memberEmail),
            this._getMemberFromTeam(teamId, memberEmail)
          ]).then((res) => {
            resolve(res);
          }).catch((err) => {
            reject(err);
          });
      });
    }

    _removeTeamPropertyFromParticipant(memberEmail) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.participantRepository.deleteTeamReference(memberEmail))
          .then((res) => {
            logger.debug('Removed team property from participant');
            resolve(res);
          }).catch((err) => {
            reject(err);
          })
      });
    }

    _getMemberFromTeam(teamId, email) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.participantRepository.findParticipantByEmail(email))
          .then((res) => {
            Promise
              .resolve(this._deleteMemberReference(teamId, res.uuid))
              .then((res) => {
                logger.debug('Got member from team and deleted its reference');
                resolve(res);
              }).catch((err) => {
                reject(err);
              });
          }).catch((err) => {
            reject(err);
          });
      });
    }

    _deleteMemberReference(teamId, memberId) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.teamRepository.deleteMemberFromTeam(teamId, memberId))
          .then((res) => {
            logger.debug('Deleted member from the team');
            resolve(res)
          }).catch((err) => {
            reject(err);
          });
      });
    }

    validateTeam(team) {
      return new Promise((resolve, reject) => {
        Promise.all([
          this.teamValidator.isRequestDataOk(team),
          this.teamValidator.isEveryDateCorrect(team.members),
          this.teamValidator.isEveryMemberInProperAge(team.members),
          this.teamValidator.isEveryEmailPatternCorrect(team.members),
          this.teamValidator.isEveryEmailAvailable(team.members),
          this.teamValidator.isNameAvailable(team.name)
        ]).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      });
    }

    getValidatedTeam(teamId) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.teamValidator.getValidatedTeam(teamId))
          .then((res) => {
            resolve(res);
          }, (err) => {
            reject(err);
          })
      });
    }

    saveTeam(team) {
      let participants = this._exactParticipants(team.members, team.name);
      this._saveParticipants(participants);
      this._createTeam(team.name, this._getMemberUuids(participants)).save();
    }

    getMemberDetails(members) {
      return new Promise((resolve) => {
        Promise
          .resolve(this.participantRepository.findParticipantByEmailArray(this._prepareUuidQuery(members)))
          .then((members) => {
            resolve(this._formatMembers(members));
          });
      });
    }

    deleteTeam(teamId, teamName) {
      return new Promise((resolve, reject) => {
        Promise
          .all([this._deleteTeamFromDatabase(teamId), this._cleanUpAfterDelete(teamName)])
          .then((res) => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
    }

    _deleteTeamFromDatabase(teamId) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.teamRepository.deleteTeam(teamId))
          .then((res) => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
    }

    _cleanUpAfterDelete(teamName) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.participantRepository.deleteTeamReferences(teamName))
          .then((res) => {
            resolve(res);
          }, (err) => {
            reject(err);
          })
      });
    }

    _formatMembers(members) {
      let arr = [];
      members.forEach((member) => {
        arr.push({
          name: member.name,
          surname: member.surname,
          email: member.email
        });
      });
      return arr;
    }

    _prepareUuidQuery(members) {
      let arr = [];
      members.forEach((member) => {
        arr.push({ uuid: member });
      });
      return arr;
    }

    _exactParticipants(members, teamName) {
      let participants = [];
      members.forEach((member) => {
        participants.push(this.participantService.makeParticipant(member, teamName));
      });
      return participants;
    }

    _getMemberUuids(members) {
      let arr = [];
      members.forEach((member) => {
        arr.push(member.uuid);
      });
      return arr;
    }

    _saveParticipants(participants) {
      participants.forEach(function (participant) {
        participant.save();
      });
    }

    _createTeam(teamName, participants) {
      let team = new Team();

      team.name = teamName;
      team.uuid = uuid.v4();
      team.members = participants;

      return team;
    }
  }

  module.exports = TeamService;
})();