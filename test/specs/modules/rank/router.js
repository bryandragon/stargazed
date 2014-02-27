'use strict';

var Backbone = require('backbone')
  , expect = chai.expect
  , RankRouter = require('../../../../src/modules/rank/router');

var mockController = {
  index: function () {},
  show: function () {}
};

describe('RankRouter', function () {
  beforeEach(function () {
    this.controller = mockController;
    this.indexRoute = sinon.spy(this.controller, 'index');
    this.showRoute = sinon.spy(this.controller, 'show');
    this.router = new RankRouter({controller: this.controller});
    Backbone.history.start({silent: true});
  });

  afterEach(function () {
    this.router.navigate('', {trigger: false});
    this.controller.index.restore();
    this.controller.show.restore();
    Backbone.history.stop();
  });

  describe('index route', function () {
    beforeEach(function () {
      this.router.navigate('Netflix', {trigger: false});
    });

    it('should invoke `index` action', function () {
      this.router.navigate('', true);
      expect(this.indexRoute.calledOnce).to.equal(true);
    });
  });

  describe('show route', function () {
    beforeEach(function () {
      this.router.navigate('', {trigger: false});
    });

    it('should invoke `show` action', function () {
      this.router.navigate('Netflix', true);
      expect(this.showRoute.withArgs('Netflix').calledOnce).to.equal(true);
    });
  });
});
