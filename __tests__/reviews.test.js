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
            votes: expect.any(Number),
            comment_count: expect.any(Number)
        });
      });
    });
  }); 
  // queries - category
  test('should return object filtered with valid queries', () => {
    return request(app)
      .get('/api/reviews/?category=hidden-roles')
      .expect(200)
      .then(({body : {reviews}}) => {
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            title: expect.any(String),
            review_id: expect.any(Number),
            category: 'hidden-roles',
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number)
          })
        })
      })
  });
  // queries - sort_by
  test('should return object filtered with valid queries', () => {
    return request(app)
      .get('/api/reviews/?sort_by=votes')
      .expect(200)
      .then(({body : {reviews}}) => {
        expect(reviews).toBeSortedBy('votes')
      })
  });
  // queries - order
  test('should return object filtered with valid queries', () => {
    return request(app)
      .get('/api/reviews/?order=desc')
      .expect(200)
      .then(({body : {reviews}}) => {
        expect(reviews).toBeSortedBy('created_at', {descending: true})
      })
  });
  // multiple queries
  test('should return object filtered with valid queries', () => {
    return request(app)
      .get('/api/reviews/?category=hidden-roles&sort_by=votes&rder=desc')
      .expect(200)
      .then(({body : {reviews}}) => {
        expect(reviews).toBeSortedBy('vote', {descending: true});
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            title: expect.any(String),
            review_id: expect.any(Number),
            category: 'hidden-roles',
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number)
          });
        });
      });
  });
  test('should return array with most recent reviews first', () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({body : {reviews}}) => {
        expect(reviews).toBeSortedBy('created_at')
    });
  }); 
  // error handling
  test('returns 400 - custom message for invalid sort query', () => {
    return request(app)
      .get("/api/reviews/?sort_by=something")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('invalid sort request')
    });
  });
  test('returns 400 - custom message for invalid order query', () => {
    return request(app)
      .get("/api/reviews/?order=something")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('invalid sort request')
    });
  });
});

describe('GET - 200: /api/reviews/:review_id', () => {
  test('returns requested review object', () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({body: {review}}) => {
        expect(review).toMatchObject({
          review_id: 2,
          title: 'Jenga',
          category: 'dexterity',
          designer: 'Leslie Scott',
          owner: 'philippaclaire9',
          review_body: 'Fiddly fun for all the family',
          review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          created_at: expect.any(String),
          votes: 5,
          comment_count: expect.any(Number)
        });
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
      test('returns 200 empty array when review has no comments', () => {
        return request(app)
          .get("/api/reviews/10/comments")
          .expect(200)
          .then(({body: {comments}}) => expect(comments).toEqual([]))
      })
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
          .then((response) => expect(response.body.msg).toBe('missing username'))
        });
      test('returns 400 error when missing body', () => {
        return request(app)
            .post("/api/reviews/1/comments")
            .send({username: 'mallionaire'})
            .expect(400)
            .then((response) => expect(response.body.msg).toBe('missing body'))
          });
      test('returns 404 error when review id valid but not exists', () => {
        return request(app)
          .post("/api/reviews/100/comments")
          .send({username: 'mallionaire', body: 'v good v good'})
          .expect(404)
          .then((response) => expect(response.body.msg).toBe('no such review!'))
        });
      test('returns 400 error when review id is invalid', () => {
        return request(app)
          .post("/api/reviews/invalid/comments")
          .send({username: 'mallionaire', body: 'v good v good'})
          .expect(400)
          .then((response) => expect(response.body.msg).toBe('baaad request x'))
          });

        })

describe('PATCH - 200 /api/review/:review_id', () => {
  test('returns updated review with vote INCREMENT', () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({inc_votes: 1})
      .expect(200)
      .then((review) => {
        expect(review.body.votes).toBe(2)
      })
  });
  test('returns updated review with vote DECREMENT', () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({inc_votes: -2})
      .expect(200)
      .then((review) => {
        expect(review.body.votes).toBe(3)
      })
  });

  // error handling
  test('returns custom err msg when decrement > existing votes', () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({inc_votes: -10})
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(`there weren/'t that many votes to start with...`)
        // how to check that review was NOT updated in error case?
      })
  });
});


