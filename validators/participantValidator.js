(function () {
  'use strict';

  let ParticipantRepository = require('persistence/participantRepository');

  class ParticipantValidator {

    static isEmailValid(email) {
      let emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegExp.test(email);
    }

    static isEmailAvailable(email) {
      return new Promise((resolve, reject) => {
        Promise.resolve(ParticipantRepository.findParticipantByEmail(email))
          .then((res) => {
            if (res)
              reject('Email is already used');
            else
              resolve();
          });
      });
    }

    static isRequestDataOk(participant) {
      return !!(participant.email && participant.name && participant.surname
      && participant.birth_date && participant.school && participant.department
      && participant.field_of_study && participant.album_number && participant.year
      && participant.size);
    }

    static checkCredentials(uuid) {
      return new Promise((resolve, reject) => {
        Promise.resolve(ParticipantRepository.findParticipantById(uuid))
          .then((res) => {
            if (res)
              resolve(res);
            else
              reject('Wrong uuid');
          });
      });
    }
  }

  module.exports = ParticipantValidator;
})();