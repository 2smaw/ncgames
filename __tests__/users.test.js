const request = require("supertest");
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const app = require("../app");
const testdata = require("../db/data/test-data/");

beforeEach(() => {
  return seed(testdata);
});

afterAll(() => {
  return db.end();
});

describe('GET: 200 - /api/users', () => {
    test('return an array of user objects', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) => {
                body.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    });
                });
            });
    });
});