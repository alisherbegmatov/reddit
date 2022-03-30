const app = require('./../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('site', function () {
  it('Should have home page', function (done) {
    chai
      .request(app)
      .get('/')
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.be.equal(200);
        return done();
      });
  });
});
