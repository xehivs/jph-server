(function () {
  'use strict';

  let express = require('express');
  let uuid = require('uuid');
  let router = express.Router();

  let ParticipantService = require('services/participantService');
  let logger = require('logger');

  let NEW_PARTICIPANT_URL = '/';
  let PARTICIPANT_URL = '/:participantId';

  router.post(NEW_PARTICIPANT_URL, checkRequest, newParticipantPost);
  router.get(PARTICIPANT_URL, getValidatedParticipant, participantGet);
  router.delete(PARTICIPANT_URL, getValidatedParticipant, participantDelete);
  router.put(PARTICIPANT_URL, participantPut);

  let service = new ParticipantService();

  function participantPut(request, response, next) {

  }

  function newParticipantPost(request, response, next) {
    service.saveParticipant(request.body);
    response.sendStatus(201);
    logger.debug('POST - new participant created');
    next();
  }

  function participantGet(request, response, next) {
    response.status(200).send(request.participant);
    logger.debug('GET - get participant data');
    next();
  }

  function participantDelete(request, response, next) {
    Promise
      .resolve(service.deleteParticipant(request.participant.id))
      .then((res) => {
        response.status(200).send(res);
        logger.debug('DELETE - participant delete was successful');
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
          logger.debug('Validate participant code successfully');
          next();
        },
        () => {
          response.sendStatus(401);
          logger.debug('Invalid participant code');
          next();
        });
  }

  function checkRequest(request, response, next) {
    Promise
      .resolve(service.validateData(request.body))
      .then((res) => {
        logger.debug('Participant request is valid');
        next();
      })
      .catch((err) => {
        response.status(400).send(err);
        logger.debug('Participant request is invalid');
        next();
      })
  }

  module.exports = router;
})();