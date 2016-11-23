(function () {
  'use strict';

  let express = require('express');
  let router = express.Router();

  let TeamService = require('services/teamService');

  let NEW_TEAM_URL = '/';
  let TEAM_URL = '/:teamId';

  router.post(NEW_TEAM_URL, checkRequest, newTeamPost);
  router.get(TEAM_URL, getValidatedTeam, getMemberDetails, teamGet);
  router.delete(TEAM_URL, getValidatedTeam, teamDelete);

  let service = new TeamService();

  function newTeamPost(request, response, next) {
    service.saveTeam(request.body);
    response.sendStatus(201);
    next();
  }

  function teamGet(request, response, next) {
    response.status(200).send(request.team);
    next();
  }

  function teamDelete(request, response, next) {
    Promise
      .resolve(service.deleteTeam(request.team.id, request.team.name))
      .then(() => {
        response.status(200).send('Successfully deleted team');
        next();
      }, () => {
        response(400);
        next();
      })
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
          next();
        },
        () => {
          response.sendStatus(401);
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
        next();
      }, (err) => {
        response.status(400).send(err);
      });
  }

  module.exports = router;
})();