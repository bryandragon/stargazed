'use strict';

var Backbone = require('backbone')
  , expect = chai.expect
  , App = require('../../src/app');

describe('App', function () {
  describe(".request('entity:repos')", function () {
    it('should configure and return a Repos collection', function () {
      function compare(repo) {
        return repo.get('name');
      }

      var repos = App.request('entity:repos', [], {comparator: compare});

      expect(repos).to.be.an.instanceOf(Backbone.Collection);
      expect(repos.comparator).to.equal(compare);
    });
  });
});
