'use strict';

var RSVP = require('rsvp');

var fs = require('fs')
  , repos = fs.readFileSync(__dirname + '/data/repos.json')
  , org = fs.readFileSync(__dirname + '/data/org.json');

/**
 * Mock GitHub service for testing.
 */
module.exports = {
  getOrg: function (name) {
    return new RSVP.Promise(function (resolve, reject) {
      if (name === 'Netflix') {
        resolve(org);
      }
      else {
        reject(new Error('Org not found'));
      }
    });
  },

  getOrgRepos: function (name, params) {
    return new RSVP.Promise(function (resolve, reject) {
      if (name === 'Netflix') {
        resolve(repos);
      }
      else {
        reject(new Error('Org not found'));
      }
    });
  }
};
