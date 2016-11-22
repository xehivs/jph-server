(function () {
  'use strict';

  let ParticipantValidator = require('validators/participantValidator');
  let ParticipantRepository = require('persistence/participantRepository');
  let TeamRepository = require('persistence/teamRepository');

  class TeamValidator {

    static isEveryEmailPatternCorrect(members) {
      members.forEach((member) => {
        if (!ParticipantValidator.isEmailValid(member.email))
          return false;
      });

      return true;
    }

    static isEveryEmailAvailable(members) {
      return new Promise((resolve, reject) => {
        if (TeamValidator._isDuplicateEmail(members))
          reject('There are duplicate members in array');

        Promise
          .resolve(ParticipantRepository.findParticipantByEmailArray(TeamValidator._prepareEmailQuery(members)))
          .then((res) => {
            if (res.length)
              reject(`${res} are used already`);
            resolve();
          });
      });
    }

    static isNameAvailable(name) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(TeamRepository.findTeamByName(name))
          .then((res) => {
            if (res.length)
              reject('Team name is already in use');
            resolve();
          });
      });
    }

    static checkCredentials(uuid) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(TeamRepository.findTeamById(uuid))
          .then((res) => {
            if (res)
              resolve(res);
             else
              reject('Wrong uuid');
          });
      });
    }

    static isRequestDataOk(team) {
      if(team.name && team.members)
        team.members.forEach((member) => {
          if(!ParticipantValidator.isRequestDataOk(member))
            return false
        });
      return true;
    }

    static _isDuplicateEmail(members) {
      !!members.reduce((a, b) => {
        return a.email !== b.email;
      });
    }

    static _prepareEmailQuery(members) {
      let arr = [];
      members.forEach((member) => {
        arr.push({email: member.email});
      });
      return arr;
    }
  }

  module.exports = TeamValidator;
})();