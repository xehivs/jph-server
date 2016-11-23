(function () {
  'use strict';

  let ParticipantValidator = require('validators/participantValidator');
  let ParticipantRepository = require('persistence/participantRepository');
  let TeamRepository = require('persistence/teamRepository');
  let DateService = require('services/dateService');

  class TeamValidator {
    constructor() {
      this.participantValidator = new ParticipantValidator();
      this.participantRepository = new ParticipantRepository();
      this.teamRepository = new TeamRepository();
    }

    isEveryEmailPatternCorrect(members) {
      return new Promise((resolve, reject) => {
        members.forEach((member) => {
          if (!this.participantValidator.isEmailValid(member.email))
            return reject()
        });
        resolve();
      });
    }

    isEveryEmailAvailable(members) {
      return new Promise((resolve, reject) => {
        if (this._isDuplicateEmail(members))
          reject('There are duplicate members in array');

        Promise
          .resolve(this.participantRepository.findParticipantByEmailArray(this._prepareEmailQuery(members)))
          .then((res) => {
            if (res.length)
              reject(`Some emails are in use already`);
            resolve();
          });
      });
    }

    isNameAvailable(name) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.teamRepository.findTeamByName(name))
          .then((res) => {
            if (res.length)
              reject('Team name is already in use');
            resolve();
          });
      });
    }

    getValidatedTeam(uuid) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.teamRepository.findTeamById(uuid))
          .then((res) => {
            if (res)
              return resolve(res);
            reject('No team exists under given id');
          });
      });
    }

    isRequestDataOk(team) {
      return new Promise((resolve, reject) => {
        if(team.name && team.members && this._isMembersRequestOk(team.members))
          return resolve();
        reject('Missing some properties');
      });
    }

    _isMembersRequestOk(members) {
      let returnValue = true;
      let properties = ['email', 'name', 'surname', 'birth_date', 'school', 'department',
        'field_of_study', 'album_number', 'year', 'size'];
      members.forEach((member) => {
        properties.forEach((property) => {
          if(!member.hasOwnProperty(property))
            returnValue = false;
        });
      });
      return returnValue;
    }

    isEveryMemberInProperAge(members) {
      return new Promise((resolve, reject) => {
        members.forEach((member) => {
          if(!DateService.isNotOlderThan(30, member.birth_date))
            return reject(`Someone is too old`);
        });
        resolve();
      });
    }

    isEveryDateCorrect(members) {
      return new Promise((resolve, reject) => {
        members.forEach((member) => {
          if(!DateService.isDateCorrect(member.birth_date))
            return reject('One of the dates is in incorrect format');
        });
        resolve();
      });
    }

    _isDuplicateEmail(members) {
      !!members.reduce((a, b) => {
        return a.email !== b.email;
      });
    }

    _prepareEmailQuery(members) {
      let arr = [];
      members.forEach((member) => {
        arr.push({email: member.email});
      });
      return arr;
    }
  }

  module.exports = TeamValidator;
})();