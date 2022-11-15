const request = require("supertest");
require('jest-sorted');
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

describe('GET - 200: /api/reviews', () => {
test('should return an array of review objects', () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({body : {reviews}}) => {
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number)
        });
      });
    });
  }); 
  test('should return array by descending order of date', () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({body : {reviews}}) => {
        expect(reviews).toBeSortedBy('created_at', {descending: true})
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

    test('returns 404 error when review id not valid', () => {
        return request(app)
          .get("/api/reviews/100/comments")
          .expect(404)
        });
});

describe('GET - 200: /api/reviews/:review_id/comments', () => {
    test('returns requested review object', () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({body: {comments}}) => {
            comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    review_id: expect.any(Number)
                })
            })
        });
      });
      test('sorted by date', () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({body: {comments}}) => {
            expect(comments).toBeSortedBy('created_at', {descending: true})
          })
      });
      test('returns 404 error when review id valid but does not exist', () => {
        return request(app)
          .get("/api/reviews/100/comments")
          .expect(404)
          .then((response) => expect(response.body.msg).toEqual('no such review!'))
        });
      // test('returns 200 empty array when review has no comments', () => {
      //   return request(app)
      //     .get("/api/reviews/??/comments")
      //     .expect(200)
      //     .then(({body}) => expect(body).toEqual([]))
      // })
});

describe('POST - 201: /api/reviews/:review_id/comments', () => {
    test('returns posted comment', () => {
        return request(app)
          .post("/api/reviews/2/comments")
          .send({username: 'mallionaire', body: 'v good v good'})
          .expect(201)
          .then((newComment) => {
            expect(newComment.body.author).toBe('mallionaire');
            expect(newComment.body.body).toBe("v good v good");
            expect(newComment.body.review_id).toBe(2);
            expect(newComment.body).toMatchObject({
                comment_id: expect.any(Number),
                created_at: expect.any(String),
                votes: expect.any(Number)
            });
        });
      });
      // error handling
      test('returns 400 error when missing username', () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send({body: 'v good v good'})
          .expect(400)
          .then((response) => expect(response.body.msg).toEqual('missing username'))
        });
      test('returns 400 error when missing body', () => {
        return request(app)
            .post("/api/reviews/1/comments")
            .send({username: 'mallionaire'})
            .expect(400)
            .then((response) => expect(response.body.msg).toEqual('missing body'))
          });
      test('returns 404 error when review id valid but not exists', () => {
        return request(app)
          .post("/api/reviews/100/comments")
          .send({username: 'mallionaire', body: 'v good v good'})
          .expect(404)
          .then((response) => expect(response.body.msg).toEqual('no such review!'))
        });
      test('returns 400 error when review id is invalid', () => {
        return request(app)
          .post("/api/reviews/invalid/comments")
          .send({username: 'mallionaire', body: 'v good v good'})
          .expect(400)
          .then((response) => expect(response.body.msg).toEqual('baaad request x'))
          });

});
