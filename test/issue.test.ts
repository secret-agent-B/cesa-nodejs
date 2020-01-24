import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Issues', () => {
  // members
  let testId: number;

  describe('POST /api/v1/issues', () => {
    it('should create Test Issue', () => {
      // Define test object
      let testIssue = {
        title: 'Test Issue',
        description: 'This is a test issue',
        submitter_id: 'radri@monsanto.com',
        project_id: 1,
        category_id: 1,
        status_id: 1,
        priority: 'L',
        date_needed: new Date()
      };

      return chai.request(app).post('/api/v1/issues')
        .send(testIssue)
        .then((res) => {
          // set id for later
          testId = res.body.result.id;

          expect(res.status).to.equal(201);
          expect(testId).to.be.a('number');
        });
    });
  });

  describe('GET /api/v1/issues/:id', () => {
    it('should find Test Issue', () => {
      return chai.request(app).get('/api/v1/issues/' + testId)
        .then((res) => {
          let testIssue = res.body.result;

          expect(res.status).to.equal(200);
          // tslint:disable-next-line:no-unused-expression
          expect(testIssue).to.exist;
          // tslint:disable-next-line:no-unused-expression
          expect(testIssue).to.be.an('object');
        });
    });

    it('should have all keys for issues', () => {
      return chai.request(app).get('/api/v1/issues/' + testId)
        .then((res) => {
          let testIssue = res.body.result;

          // tslint:disable-next-line:no-unused-expression
          expect(testIssue).to.exist;
          expect(testIssue).to.have.all.keys([
            'id',
            'title',
            'description',
            'submitter_id',
            'project_id',
            'category_id',
            'status_id',
            'priority',
            'date_needed',
            'date_created',
            'date_modified'
          ]);
        });
    });
  });

  describe('GET /api/v1/issues', () => {
    it('responses with JSON array', () => {
      return chai.request(app).get('/api/v1/issues')
        .then((res) => {
          expect(res.status).to.equal(200);
          // tslint:disable-next-line:no-unused-expression
          expect(res).to.be.json;
          expect(res.body.result).to.be.an('array');
        });
    });
  });

  describe('PUT /api/v1/issues/:id', () => {
    // Define test object
    let testIssue = {
      title: 'Test Issue',
      description: 'This is a test issue',
      submitter_id: 'radri@monsanto.com',
      project_id: 1,
      category_id: 1,
      status_id: 1,
      priority: 'L',
      date_needed: new Date()
    };

    it('should update Test Issue', () => {
      return chai.request(app).put('/api/v1/issues/' + testId)
        .send(testIssue)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Success');
        });
    });
  });

  describe('DELETE /api/v1/issues/:id', () => {
    it('should delete Test Issue', () => {
      return chai.request(app).del('/api/v1/issues/' + testId)
        .then((res) => {
          expect(res.status).to.equal(204); // No Content
        });
    });
  });
});
