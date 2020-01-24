import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Projects', () => {

  describe('GET api/v1/projects', () => {

    it('responses with JSON array', () => {
      return chai.request(app).get('/api/v1/projects')
        .then((res) => {
          expect(res.status).to.equal(200);
          // tslint:disable-next-line:no-unused-expression
          expect(res).to.be.json;
          expect(res.body.result).to.be.an('array');
        });
    });

    it('Document Automation should be have project keys', () => {
      return chai.request(app).get('/api/v1/projects')
        .then((res) => {
          let documentAutomation = res.body.result.find(x => x.name === 'Document Automation');
          // tslint:disable-next-line:no-unused-expression
          expect(documentAutomation).to.exist;
          expect(documentAutomation).to.have.all.keys([
            'id',
            'name',
            'description',
            'url',
            'primary_email',
            'slack',
            'date_created',
            'date_modified'
          ]);
        });
    });

  });

  describe('GET api/v1/projects/:id', () => {

    it('responds with a single JSON object', () => {
      return chai.request(app).get('/api/v1/projects/1')
      .then((res) => {
          expect(res.status).to.equal(200);
          // tslint:disable-next-line:no-unused-expression
          expect(res).to.be.json;
          expect(res.body.result).to.be.an('object');
        });
    });

    it('should return Document Automation', () => {
      return chai.request(app).get('/api/v1/projects/1')
      .then((res) => {
          let documentAutomation = res.body.result;
          expect(documentAutomation.name).to.equal('Document Automation');
        });
    });

  });

  describe('PUT api/v1/projects/2', () => {

    it('responds with 200', () => {
      // Define test object.
      let project = {
        name: 'Regulatory Data Repository',
        description: 'Data repository for all results data used for Regulatory documents.',
        url: 'https://regsci.velocity.ag/rdr/',
        primary_email: 'ryan.adriano@mosanto.com',
        slack: '#rdr'
      };

      return chai.request(app).put('/api/v1/projects/2')
        .send(project)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
        });
    });

  });

});
