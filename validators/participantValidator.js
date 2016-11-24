(function () {
  'use strict';

  let ParticipantRepository = require('persistence/participantRepository');
  let TeamRepository = require('persistence/teamRepository');
  let DateService = require('services/dateService');
  let logger = require('logger');

  class ParticipantValidator {

    constructor() {
      this.participantRepository = new ParticipantRepository();
      this.teamRepository = new TeamRepository();
    }

    isEmailValid(email) {
      let emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return new Promise((resolve, reject) => {
        if (emailRegExp.test(email))
          return resolve();
        reject('Email format is invalid');
      });
    }

    isEmailAvailable(email) {
      return new Promise((resolve, reject) => {
        Promise.resolve(this.participantRepository.findParticipantByEmail(email))
          .then((res) => {
            if (res)
              return reject('Email is already in use');
            resolve();
          });
      });
    }

    isRequestDataOk(participant) {
      let properties = ['email', 'name', 'surname', 'birth_date', 'school', 'department',
        'field_of_study', 'album_number', 'year', 'size'];
      return new Promise((resolve, reject) => {
        properties.forEach((property) => {
          if(!participant.hasOwnProperty(property))
            return reject(`Missing ${property} property`);
        });
        resolve();
      });
    }

    checkCredentials(uuid) {
      return new Promise((resolve, reject) => {
        Promise.resolve(this.participantRepository.findParticipantById(uuid))
          .then((res) => {
            if (res)
              return resolve(res);
            reject('No participant exist under given id');
          });
      });
    }

    isNotTooOld(birthDate) {
      return new Promise((resolve, reject) => {
        if(DateService.isNotOlderThan(30, birthDate))
          return resolve();
        reject('Too old participant');
      });
    }

    isDateCorrect(date) {
      return new Promise((resolve, reject) => {
        if(DateService.isDateCorrect(date))
          return resolve();
        reject('Wrong date pattern');
      });
    }

    isTeamLimitReached(teamId) {
      return new Promise((resolve, reject) => {
        Promise
          .resolve(this.teamRepository.findTeamById(teamId))
          .then((res) => {
            if(res.members.length >= 4)
              return reject('Team is full');
            resolve(res);
          })
          .catch((err) => {
            reject(err)
          });
      });
    }
  }

  module.exports = ParticipantValidator;
})();