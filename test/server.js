/*global describe, it*/
import superagent from 'supertest';
import app from '../data/app';

function request() {
  return superagent(app.listen());
}

// describe('crashes', () => {
//   describe('GET /crashes', () => {
//     it('should return 200', (done) => {
//       request()
//         .get('/crashes')
//         .expect(200, done);
//     });
//   });
// });

describe('release', () => {
  describe('GET /release', () => {
    it('should return 200', (done) => {
      request()
        .get('/release/')
        .expect(200, done);
    });
  });

  describe('GET /release/all', () => {
    it('should return 200', (done) => {
      request()
        .get('/release/all')
        .expect(200, done);
    });
  });

  describe('GET /release/chrome', () => {
    it('should return 200', (done) => {
      request()
        .get('/release/chrome')
        .expect(200, done);
    });
  });

  describe('GET /release/latest', () => {
    it('should return 200', (done) => {
      request()
        .get('/release/latest')
        .expect(200, done);
    });
  });

  describe('GET /release/history', () => {
    it('should return 200', (done) => {
      request()
        .get('/release/history')
        .expect(200, done);
    });
  });

  describe('GET /release/calendar', () => {
    it('should return 200', (done) => {
      request()
        .get('/release/calendar')
        .expect(200, done);
    });
  });

  describe('GET /release/updates', () => {
    it('should return 200', (done) => {
      request()
        .get('/release/updates')
        .expect(200, done);
    });
  });
});
