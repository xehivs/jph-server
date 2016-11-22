(function () {
  'use strict';

  let express = require('express');
  let router = express.Router();

  let TeamService = require('services/teamService');
  let TeamValidator = require('validators/teamValidator');

  let NEW_TEAM_URL = '/';
  let TEAM_URL = '/:teamId';

  router.post(NEW_TEAM_URL, checkRequestData, checkNameAvailability, checkEmailsPattern, checkEmailsAvailability, newTeamPost);
  router.get(TEAM_URL, checkCredentials, getMemberDetails, teamGet);

  function newTeamPost(request, response, next) {
    TeamService.saveTeam(request.body);
    response.sendStatus(201);
    next();
  }

  function teamGet(request, response, next) {
    response.status(200).send(request.team);
    next();
  }

  function checkCredentials(request, response, next) {
    Promise
      .resolve(TeamValidator.checkCredentials(request.params.teamId))
      .then((res) => {
          request.team = {
            id: res.uuid,
            name: res.name,
            members: res.members
          };
          next();
        },
        () => {
          response.sendStatus(401);
        });
  }

  function getMemberDetails(request, response, next) {
    Promise
      .resolve(TeamService.getMemberDetails(request.team.members))
      .then((res) => {
        request.team.members = res;
        next();
      });
  }

  function checkNameAvailability(request, response, next) {
    Promise
      .resolve(TeamValidator.isNameAvailable(request.body.name))
      .then(() => {
          next();
        },
        () => {
          response.sendStatus(400);
        });
  }

  function checkEmailsPattern(request, response, next) {
    if (TeamValidator.isEveryEmailPatternCorrect(request.body.members)) {
      next()
    } else {
      response.sendStatus(400);
    }
  }

  function checkEmailsAvailability(request, response, next) {
    Promise
      .resolve(TeamValidator.isEveryEmailAvailable(request.body.members))
      .then(() => {
          next();
        },
        () => {
          response.sendStatus(400);
        });
  }

  function checkRequestData(request, response, next) {
    if(TeamValidator.isRequestDataOk(request.body))
      next();
    else
      response.sendStatus(400);
  }

  module.exports = router;
})();