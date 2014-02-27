'use strict';

var RSVP = require('rsvp')
  , expect = chai.expect
  , GitHubService = require('../../../../src/common/services/github');

describe('GitHubService', function () {
  beforeEach(function () {
    this.service = new GitHubService;
  });

  describe('.preparePath()', function () {
    it('should return a properly-formatted path', function () {
      var context = {owner: 'Netflix', repo: 'asgard'}
        , params = {per_page: 100}
        , path = this.service.preparePath('GET', 'repos/:owner/:repo/commits', context, params);

      expect(path).to.equal('https://api.github.com/repos/Netflix/asgard/commits?per_page=100');
    });
  });

  describe('.getOrg()', function () {
    it('should respond with a promise', function () {
      var result = this.service.getOrg('Netflix');

      expect(result).to.be.an.instanceOf(RSVP.Promise);
    });
  });

  describe('.getOrgRepos()', function () {
    it('should respond with a promise', function () {
      var result = this.service.getOrgRepos('Netflix');

      expect(result).to.be.an.instanceOf(RSVP.Promise);
    });
  });
});
