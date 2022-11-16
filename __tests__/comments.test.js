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

describe('DELETE - 204: /api/comments/:comment_id', () => {
    test('should return empty body', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then((response) => {
            expect(response.body).toEqual({})
        })
    });
    // error handling
    test('should return error message if comment requested does not exist', () => {
        return request(app)
        .delete('/api/comments/200')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe(`there\'s no such comment`)
        })
    });
});