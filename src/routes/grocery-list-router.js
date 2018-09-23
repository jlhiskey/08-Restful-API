'use strict';

// Jason- Requirements
const GroceryList = require('../model/grocery-list');
const app = require('../lib/router');
const logger = require('../lib/logger');

// Local Storage Database
const groceryListStorage = [];

//! Jason- Need this to make logger functional
const sendStatus = (statusCode, message, response) => {
  logger.log(logger.INFO, `Responding with a ${statusCode} status code due to ${message}`);
  response.writeHead(statusCode);
  response.end();
};

//! Jason- This will be needed to send the response in JSON once our request is received
const sendJSON = (statusCode, data, response) => {
  logger.log(logger.INFO, `Responding with a ${statusCode} status and the following data`);
  logger.log(logger.INFO, JSON.stringify(data));

  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(data));
  response.end();
};
// ROUTES--------------------------------------------------------------------------------------
//! Jason- This POST route will be used when someone wants to add groceries to their list
app.post('/api/grocery-list', (request, response) => {
  // This will handle if any errors arise from the request
  if (!request.body) {
    sendStatus(400, 'Body Not Found', response);
    return undefined;
  }
  if (!request.body.groceryListName) {
    sendStatus(400, 'Grocery List Name Not Input', response);
    return undefined;
  }

  if (!request.body.groceryItem) {
    sendStatus(400, 'Grocery List Item Not Input', response);
    return undefined;
  }
  //! Jason- If the request had all the proper goodies we will then make a new GroceryList
  const groceryList = new GroceryList(request.body.name, request.body.item);
  groceryListStorage.push(groceryList);
  sendJSON(200, groceryList, response);
  return undefined;
});

//! Jason- This GET route will be used when someone wants to find something from their their list
// BROKEN CODE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// app.get('/api/grocery-list', (request, response) => {
//   if (request.url.query.id) {
//     // This is not going to work. Im just super lost and trying to pseudocode to get at least a
//     // general idea of what the hell i should be doing.
//     let groceryList = [];
//     for (let i = 0; i < groceryListStorage.length; i++) {
//       if (groceryListStorage[i].id === request.url.query.id) {
//          groceryList = groceryListStorage[i]
//       .then( groceryList => {
//         sendJSON(200, groceryList, response);
//       })
//       .catch(err => {
//         sendStatus(404, 'Grocery List Not Found', err);
//       });
//     return undefined;
//   }
//   // Dont know what to do here for the get all function
//   .then( () => {
//       sendJSON(200, groceryListStorage, response);
//     })
//       .catch(err => {
//         sendStatus(404, 'Grocery Lists Not Found', err);
//       });
//     return undefined;
//   });

//! Jason- This DELETE route will be used when someone wants to find something from their their list
app.delete('/api/grocery-list', (request, response) => {
  if (request.url.query.id) {
    for (let i = 0; i < groceryListStorage.length; i++) {
      if (groceryListStorage[i].id === request.url.query.id) {
        groceryListStorage.splice(i, 1)
          .then(() => {
            sendJSON(200, groceryListStorage, response);
          })
          .catch((err) => {
            sendStatus(404, 'Grocery List Not Found', err);
          });
      }
    }
  }
  return undefined;
});
