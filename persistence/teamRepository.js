(function () {
  'use strict';

  let Team = require('persistence/models/teamEntity');
  let logger = require('logger');

  class TeamRepository {

    findTeamById(uuid) {
      return new Promise((resolve, reject) => {
        Team.findOne({uuid: uuid}, (err, result) => {
          if (err)
            return reject(err);
          resolve(result);
        });
      });
    }

    findTeamByName(name) {
      return new Promise((resolve, reject) => {
        Team.find({name: name}, (err, result) => {
          if(err)
            return reject(err);
          resolve(result);
        });
      });
    }

    deleteParticipantReferences(participantId) {
      return new Promise((resolve, reject) => {
          Team.update({members: participantId}, {$pull: {members: participantId}}, (err, result) => {
            if(err)
              return reject(err);
            resolve(result);
          });
      });
    }

    deleteTeam(teamId) {
      logger.debug(`Removing ${teamId}`);
      return new Promise((resolve, reject) => {
        Team.remove({uuid: teamId}, (err, result) => {
          if(err)
            return reject(err);
          resolve(result);
        });
      });
    }

    deleteMemberFromTeam(teamId, memberId) {
      logger.debug(`Removing ${memberId} from ${teamId}`);
      return new Promise((resolve, reject) => {
        Team.update({uuid: teamId}, {$pull: {members: memberId}}, (err, result) => {
          if(err)
            return reject(err);
          resolve(result);
        });
      });
    }

    pushNewParticipant(teamId, memberId) {
      logger.debug(`Adding ${memberId} to ${teamId}`);
      return new Promise((resolve, reject) => {
        Team.update({uuid: teamId}, {$push: {members: memberId}}, (err, result) => {
          if(err)
            reject(err);
          resolve(result);
        });
      });
    }
  }

  module.exports = TeamRepository;
})();