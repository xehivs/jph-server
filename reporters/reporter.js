(function () {
  'use strict';

  let Status = require('commons/status');

  class Reporter {
    constructor() {
      this.messages = [];
    }

    addMessage(status, description) {
      this.messages.push(new Message(status, description));
    }

    report() {
      let report = '';
      this.messages.forEach(function (message) {
        report += message.format();
      });

      return report;
    }
  }

  class Message {
    constructor(status, description) {
      this._status = status;
      this._description = description;
    }

    format() {
      return `Status: ${this._status} 
                Description: ${this._description} \n`;
    }
  }

  module.exports = Reporter;
})();