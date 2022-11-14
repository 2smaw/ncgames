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

describe('GET - 200: /api/reviews/:review_id', () => {
    test('returns requested review object', () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then(({body: {review}}) => {
            expect(review).toEqual({
                title: 'Agricola',
    designer: 'Uwe Rosenberg',
    owner: 'mallionaire',
    review_img_url:
      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
    review_body: 'Farmyard fun!',
    review_id: 1,
    category: 'euro game',
    created_at: '2021-01-18T10:00:20.514Z',
    votes: 1
            })
        });
      });
});