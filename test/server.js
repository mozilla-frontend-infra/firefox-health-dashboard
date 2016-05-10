/*global describe, it*/
import superagent from 'supertest';
import app from '../src/app';

function request() {
  return superagent(app.listen());
}

describe('/release', () => {
  describe('GET /release/', () => {
    it('should return 200', (done) => {
      request()
        .get('/api/release/')
        .expect(200, done);
    });
  });

  describe('GET /release/archive/', () => {
    it('should return 200', (done) => {
      request()
        .get('/api/release/archive')
        .expect(200, done);
    });
  });

  describe('GET /release/chrome/', () => {
    it('should return 200', (done) => {
      request()
        .get('/api/release/chrome')
        .expect(200, done);
    });
  });

  describe('GET /release/latest/', () => {
    it('should return 200', (done) => {
      request()
        .get('/api/release/latest')
        .expect(200, done);
    });
  });

  describe('GET /release/history/', () => {
    it('should return 200', (done) => {
      request()
        .get('/api/release/history')
        .expect(200, done);
    });
  });

  describe('GET /release/calendar/', () => {
    it('should return 200', (done) => {
      request()
        .get('/api/release/calendar')
        .expect(200, done);
    });
  });

  describe('GET /release/updates/', () => {
    it('should return 200', (done) => {
      request()
        .get('/api/release/updates')
        .expect(200, done);
    });
  });
});

describe('/crashes', () => {
  if (process.env.REDASH_API_KEY) {
    describe('GET /crashes/', () => {
      it('should return 200', (done) => {
        request()
        .get('/api/crashes/')
        .expect(200, done);
      });
    });
  }
  describe('GET /crashes/adi/', () => {
    it('should return 200', (done) => {
      request()
        .get('/api/crashes/adi/')
        .expect(200, done);
    });
    it('should return 200 for Fennec', (done) => {
      request()
        .get('/api/crashes/adi/?product=fennec')
        .expect(200, done);
    });
  });
});

describe('/bz', () => {
  describe('GET /regressions/', () => {
    it('should return 200', (done) => {
      request()
        .get('/api/bz/regressions/')
        .expect(200, done);
    });
  });
  describe('GET /regressions/missed/', () => {
    it('should return 200', (done) => {
      request()
        .get('/api/bz/regressions/missed/')
        .expect(200, done);
    });
  });
});
