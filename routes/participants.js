(function () {
  'use strict';

  let express = require('express');
  let uuid = require('uuid');
  let router = express.Router();

  let ParticipantService = require('services/participantService');
  let ParticipantValidator = require('validators/participantValidator');

  let NEW_PARTICIPANT_URL = '/new';
  let PARTICIPANT_URL = '/edit/:participantId';

  router.post(NEW_PARTICIPANT_URL, checkRequestData, checkEmailPattern, checkEmailAvailability, newParticipantPost);
  router.get(PARTICIPANT_URL, checkCredentials, participantGet);
  router.delete(PARTICIPANT_URL, checkCredentials, participantDelete);

  function newParticipantPost(request, response, next) {
    ParticipantService.saveParticipant(request.body);
    response.sendStatus(201);
    next();
  }

  function participantGet(request, response, next) {
    response.status(200).send(request.participant);
    next();
  }

  function participantDelete(request, response, next) {
    Promise
      .resolve(ParticipantService.deleteParticipant(request.participant.id))
      .then((res) => {
        response.status(200).send(res);
        next();
      });
  }

  function checkCredentials(request, response, next) {
    Promise
      .resolve(ParticipantValidator.checkCredentials(request.params.participantId))
      .then((res) => {
          request.participant = {
            id: res.uuid,
            name: res.name,
            surname: res.surname,
            team: res.team
          };
          next();
        },
        () => {
          response.sendStatus(401);
        });
  }

  function checkEmailPattern(request, response, next) {
    if (ParticipantValidator.isEmailValid(request.body.email))
      next();
    else{
      response.sendStatus(400);
    }
  }

  function checkEmailAvailability(request, response, next) {
    Promise
      .resolve(ParticipantValidator.isEmailAvailable(request.body.email))
      .then(() => {
          next();
        },
        () => {
          response.sendStatus(400);
        });
  }

  function checkRequestData(request, response, next) {
    if(ParticipantValidator.isRequestDataOk(request.body))
      next();
    else
      response.sendStatus(400);
  }

  module.exports = router;
})();