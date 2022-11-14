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

describe('200 = GET /api/categories', () => {
test('should return an array of category objects', () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({body : {categories}}) => {
        categories.forEach((category) => {
          expect(Object.keys(category).length).toBe(2);
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String)
        });
      });
    });
  });
});