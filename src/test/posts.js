const app = require('./../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const agent = chai.request.agent(app);

const User = require('../models/user');
const Post = require('../models/post');

chai.should();
chai.use(chaiHttp);

describe('Posts', function () {
  const newPost = {
    title: 'post title',
    url: 'https://www.google.com',
    summary: 'post summary',
    subreddit: 'try',
  };
  const user = {
    username: 'poststest',
    password: 'testposts',
  };

  before(function (done) {
    agent
      .post('/sign-up')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(user)
      .then(function (res) {
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  it('Should create with valid attributes at POST /posts/new', function (done) {
    Post.estimatedDocumentCount()
      .then(function (initialDocCount) {
        agent
          .post('/posts/new')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send(newPost)
          .then(function (res) {
            Post.estimatedDocumentCount()
              .then(function (newDocCount) {
                expect(res).to.have.status(200);
                expect(newDocCount).to.be.equal(initialDocCount + 1);
                done();
              })
              .catch(function (err) {
                console.log(err);
                done();
              });
          })
          .catch(function (err) {
            console.log(err);
            done();
          });
      })
      .catch(function (err) {
        console.log(err);
        done();
      });
  });
  after(function (done) {
    Post.findOneAndDelete(newPost)
      .then(function (res) {
        agent.close();

        User.findOneAndDelete({
          username: user.username,
        })
          .then(function (res) {
            done();
          })
          .catch(function (err) {
            done(err);
          });
      })
      .catch(function (err) {
        done(err);
      });
  });
});
