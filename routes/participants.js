(function () {
  'use strict';

  let express = require('express');
  let uuid = require('uuid');
  let router = express.Router();

  let ParticipantService = require('services/participantService');

  let NEW_PARTICIPANT_URL = '/';
  let PARTICIPANT_URL = '/:participantId';

  router.post(NEW_PARTICIPANT_URL, checkRequest, newParticipantPost);
  router.get(PARTICIPANT_URL, getValidatedParticipant, participantGet);
  router.delete(PARTICIPANT_URL, getValidatedParticipant, participantDelete);

  let service = new ParticipantService();

  function newParticipantPost(request, response, next) {
    service.saveParticipant(request.body);
    response.sendStatus(201);
    next();
  }

  function participantGet(request, response, next) {
    response.status(200).send(request.participant);
    next();
  }

  function participantDelete(request, response, next) {
    Promise
      .resolve(service.deleteParticipant(request.participant.id))
      .then((res) => {
        response.status(200).send(res);
        next();
      }, () => {
        response.status(400);
      });
  }

  function getValidatedParticipant(request, response, next) {
    Promise
      .resolve(service.getValidatedParticipant(request.params.participantId))
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

  function checkRequest(request, response, next) {
    Promise
      .resolve(service.validateData(request.body))
      .then((res) => {
        next();
      })
      .catch((err) => {
        response.status(400).send(err);
      })
  }


  module.exports = router;
})();