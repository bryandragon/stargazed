'use strict';

var Backbone = require('backbone')
  , expect = chai.expect
  , App = require('../../../../src/app')
  , RankController = require('../../../../src/modules/rank/controller')
  , mockService = require('../../../support/mock-service');

describe('RankController', function () {
  before(function () {
    this.controller = new RankController({
      service: mockService
    });
  });

  it('should fetch org repos when model name changes', function () {
    var fetchOrgRepos = sinon.spy(this.controller, 'fetchOrgRepos');

    this.controller.model.trigger('change:name', 'Netflix');
    expect(fetchOrgRepos.calledOnce).to.equal(true);
    this.controller.fetchOrgRepos.restore();
  });

  describe('.fetchOrgRepos()', function () {
    it('should update model state while fetching', function () {
      var onChangeLoading = sinon.spy();

      this.controller.model.on('change:loading', onChangeLoading);
      this.controller.fetchOrgRepos('Netflix');
      expect(onChangeLoading.calledOnce).to.equal(true);
      this.controller.model.off('change:loading', onChangeLoading);
    });
  });

  describe('.sort()', function () {
    it('should compare two models by `stargazers_count`', function () {
      var a = new Backbone.Model({stargazers_count: 10})
        , b = new Backbone.Model({stargazers_count: 20})
        , c = new Backbone.Model({stargazers_count: 10});

      expect(this.controller.sort(b, a)).to.equal(-1);
      expect(this.controller.sort(a, b)).to.equal(1);
      expect(this.controller.sort(a, c)).to.equal(0);
    });
  });
});
