const request = require("supertest");
require('jest-sorted');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const app = require("../app");
const testdata = require("../db/data/test-data");

beforeEach(() => {
    return seed(testdata);
  });
  
afterAll(() => {
return db.end();
});

describe('GET - 200: /api', () => {
    test('return json object of all endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body: {endpoints}}) => {
            expect(endpoints).toHaveLength(9)
        })
    });
});