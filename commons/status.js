(function () {
  'use strict';

  class Status {
    static get ERROR() {
      return 'Error';
    }

    static get UNAUTHORIZED() {
      return 'Unauthorized';
    }

    static get SUCCESS() {
      return 'Success';
    }
  }

  module.exports = Status;
})();