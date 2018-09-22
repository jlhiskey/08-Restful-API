'use strict';

//! Jason- Requirements
const http = require('http');
const logger = require('./logger');
const router = require('./router');
require('../routes/grocery-list-router');

//! Jason- I think this is NODE 'http' magic that will start looking for requests
const app = http.createServer(router.findAndExecuteRoutes);
//--------------------------------------------------------------------------------------------------
//! Jason- This will set server.js as a module.
const server = module.exports = {};

//! Jason- Lets give the server a power switch.
/**
 *
 * @param port Designates what port we will be using for the server.
 */
//! Jason- ON SWITCH
server.start = (port) => {
  //! Jason- Awakens the 'http' beast who proceeds to cast their magic and make the server work.
  return app.listen(port, () => {
    //! Jason- Creates a log that tells us that the server is alive and what port it is on.
    logger.log(logger.INFO, `Server is up on PORT: ${port}`);
  });
};

//! Jason- OFF SWITCH
server.stop = () => {
  //! Jason- Awakens the 'http' beast who proceeds to cast their magic and make the server work.
  return app.close(() => {
    //! Jason- Creates a log that tells us that the server is now off.
    logger.log(logger.INFO, 'Server is OFF');
  });
};
