(function () {
  'use strict';

  let express = require('express');
  let router = express.Router();
  let logger = require('logger');

  let TeamService = require('services/teamService');

  let NEW_TEAM_URL = '/';
  let TEAM_URL = '/:teamId';

  router.post(NEW_TEAM_URL, checkRequest, newTeamPost);
  router.get(TEAM_URL, getValidatedTeam, getMemberDetails, teamGet);
  router.delete(TEAM_URL, getValidatedTeam, teamDelete);
  router.put(TEAM_URL, getValidatedTeam, teamUpdate);

  let service = new TeamService();

  function newTeamPost(request, response, next) {
    service.saveTeam(request.body);
    response.sendStatus(201);
    logger.debug('POST - new team created successfully');
    next();
  }

  function teamGet(request, response, next) {
    response.status(200).send(request.team);
    logger.debug('GET - team information retrieved');
    next();
  }

  function teamDelete(request, response, next) {
    Promise
      .resolve(service.deleteTeam(request.team.id, request.team.name))
      .then(() => {
        response.status(200).send('Successfully deleted team');
        logger.debug('DELETE - successfully deleted team');
        next();
      }, () => {
        response(400);
        next();
      })
  }

  function teamUpdate(request, response, next) {
    Promise
      .resolve(this.teamService.kickMember(request.team.name, request.body.participantEmail))
      .then((res) => {
        response.status(200).send(res);
        next();
      }).catch((err) => {
        reponse.sendStatus(400);
      });
  }

  function getValidatedTeam(request, response, next) {
    Promise
      .resolve(service.getValidatedTeam(request.params.teamId))
      .then((res) => {
          request.team = {
            id: res.uuid,
            name: res.name,
            members: res.members
          };
          logger.debug('Validated team code successfully');
          next();
        },
        () => {
          response.sendStatus(401);
          logger.debug('Invalid team code');
          next();
        });
  }

  function getMemberDetails(request, response, next) {
    Promise
      .resolve(service.getMemberDetails(request.team.members))
      .then((res) => {
        request.team.members = res;
        next();
      });
  }

  function checkRequest(request, response, next) {
    Promise
      .resolve(service.validateTeam(request.body))
      .then((res) => {
        logger.debug('Team request is valid');
        next();
      }, (err) => {
        logger.debug('Team request is invalid');
        response.status(400).send(err);
        next();
      });
  }

  module.exports = router;
})();