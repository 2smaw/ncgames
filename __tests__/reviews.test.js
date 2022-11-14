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

describe('200 - GET /api/reviews', () => {
test('should return an array of review objects', () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({body : {reviews}}) => {
        reviews.forEach((review) => {
          expect(Object.keys(review).length).toBe(9);
          expect(review).toMatchObject({
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number)
        });
      });
    });
  }); 
});

