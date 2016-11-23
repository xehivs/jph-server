(function () {
  'use strict';

  let moment = require('moment');

  class DateService {
    static isNotOlderThan(age, birthDate) {
      if(DateService.isDateCorrect(birthDate))
        return moment().diff(birthDate, 'years', true) < age;
      return false;
    }

    static isDateCorrect(date) {
      let dateRegexp = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
      return dateRegexp.test(date);
    }
  }

  module.exports = DateService;
})();