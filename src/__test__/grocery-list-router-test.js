'use strict';

const superagent = require('superagent');
const server = require('../lib/server');

describe('/api/grocery-list', () => {
  beforeAll(server.start);

  test('should respond with 200 status code and a new json note', () => {
    return superagent.post('http://localhost:3000/api/grocery-list')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Jason Grocery',
        item: 'Beer',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.item).toEqual('Beer');
        expect(response.body.name).toEqual('Jason Grocery');

        expect(response.body.timestamp).toBeTruthy();
        expect(response.body.id).toBeTruthy();
      });
  });
  test('should respond with 400 status code if there is no title', () => {
    return superagent.post('http://localhost:3000/api/grocery-list')
      .set('Content-Type', 'application/json')
      .send({
        content: 'Beer',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
});
