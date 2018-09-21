'use strict';

// Jason- Requirements
const url = require('url');
const queryString = require('querystring');
const logger = require('./logger');

// Jason- Set this up as a module.
const requestParser = module.exports = {};

/**
 * Request parser will take the data from the bodies from POST and PUT requests and parse them.
 * @returns {Promise<any>}
 */
requestParser.parseAsync = (request) => {
  return new Promise((resolve, reject) => {
    //! Jason- Adding a logger to help figure out what the original request looked like.
    logger.log(logger.INFO, `Original URL: ${request.url}`);
    //! Jason- Checking to see if request is anything other than a POST or PUT is if it is
    // resolving the promise.
    if (request.method !== 'POST' && request.method !== 'PUT') {
      return resolve(request);
    }
    //! Jason- Creates and empty container to put the final parsed body into.
    let completeBody = '';
    //! Jason- I think that this is taking in the raw data and adding it to completeBody container
    // as stringified data.
    request.on('data', (buffer) => {
      completeBody += buffer.toString();
    });
    //! Jason- Once all of the data from the buffer has been received stringified and added onto
    // completeBody we want to add it to the body of the request as an object (JSON.parse)
    request.on('end', () => {
      try {
        request.body = JSON.parse(completeBody);
        //! Jason- Now that our data has become a part of request.body we are happy and return the
        // promise as resolved
        console.log('here');
        return resolve(request);
        //! Jason- Now we add a catch just in case something from above breaks.
      } catch (error) {
        return reject(error);
      }
    });
    return undefined;
  });
};
