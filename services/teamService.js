(function () {
  'use strict';

  let uuid = require('uuid');

  let Team = require('persistence/models/teamEntity');
  let ParticipantService = require('services/participantService');
  let ParticipantRepository = require('persistence/participantRepository');

  class TeamService {
    static saveTeam(team) {
      let participants = TeamService._exactParticipants(team.members, team.name);
      TeamService._saveParticipants(participants);
      TeamService._createTeam(team.name, TeamService._getMemberUuids(participants)).save();
    }

    static getMemberDetails(members) {
      return new Promise((resolve) => {
        Promise
          .resolve(ParticipantRepository.findParticipantByEmailArray(TeamService._prepareUuidQuery(members)))
          .then((members) => {
            resolve(TeamService._formatMembers(members));
          });
      });
    }

    static _formatMembers(members) {
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

    static _prepareUuidQuery(members) {
      let arr = [];
      members.forEach((member) => {
        arr.push({uuid: member});
      });
      return arr;
    }

    static _exactParticipants(members, teamName) {
      let participants = [];
      members.forEach(function (member) {
        participants.push(ParticipantService.makeParticipant(member, teamName));
      });
      return participants;
    }

    static _getMemberUuids(members) {
      let arr = [];
      members.forEach((member) => {
          arr.push(member.uuid);
      });
      return arr;
    }

    static _saveParticipants(participants) {
      participants.forEach(function (participant) {
        participant.save();
      });
    }

    static _createTeam(teamName, participants) {
      let team = new Team();

      team.name = teamName;
      team.uuid = uuid.v4();
      team.members = participants;

      return team;
    }
  }

  module.exports = TeamService;
})();