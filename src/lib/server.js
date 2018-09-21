'use strict';

//! Jason- Requirements

const http = require('http');
const cowsay = require('cowsay');
const logger = require('./logger');
const requestParser = require('./url-parser');

//! Jason- I think this is NODE 'http' magic that will start looking for requests
const app = http.createServer((request, response) => {
  //! Jason- Adding some logs so that I can figure out what is requests 'http' is getting and what
  // they look like.
  logger.log(logger.INFO, 'New Request');
  logger.log(logger.INFO, `METHOD: ${request.method}`);
  logger.log(logger.INFO, `ROUTE: ${request.url}`);

  //! Jason- Now we will feed the content of the request into the url-parser and after url-parser
  // is done working with the data it will return the data to app as an property of the request
  // called body (request.body)
  return requestParser.parseAsync(request)
  //! Jason- now that we have the data were gonna call it parsedRequest and do something with it.
    .then((parsedRequest) => {
      //! Jason- This will handle a client logging onto the homepage of the site.
      if (parsedRequest.method === 'GET' && parsedRequest.url === '/') {
        //! Jason- If the above condition is true then the response will gain a property called
        // writeHead which will send out a 200 saying that life is good and will declare the content
        // type to be text/html. I think that this is info for TCP
        response.writeHead(200, { 'Content-Type': 'text/html' });

        //! Jason- Now we add a property to the response called write which will contain the body
        // that the response will need to render the info on the users browser.
        response.write(`<!DOCTYPE html>
          <html>
            <head>
              <title> cowsay </title>  
            </head>
            <body>
             <header>
               <nav>
                 <ul> 
                   <li><a href="/api/cowsay">cowsay</a></li>
                 </ul>
               </nav>
             <header>
             <main>
               This app uses the api cowsay to make a message you send to look like its coming out of a cows mouth... 
             </main>
            </body>
          </html>
        `);

        //! Jason- Now we will log the event so that we know we have our html content
        logger.log(logger.INFO, 'Status:200 We have sent the HTML Document to Client');

        //! Jason- Now that we have everything we want in this response we can send it.
        response.end();
        return undefined; //! Jason- This seems hackey but I will accept that it needs to be here.
        //! Jason- Now we will handle the client trying to POST something to the api cowsay.
      }
      if (parsedRequest.method === 'POST' && parsedRequest.url === '/api/cowsay') {
        //! Jason- If above conditions are met then response will have a property called writeHead
        // which will send out a 200 and will declare that the content is application/json
        response.writeHead(200, { 'Content-Type': 'application/json' });
        //! Jason- Now we need to take the text from our parsedRequest and make sure it comes out
        // of the cows mouth.
        const cowsayResponse = cowsay.say({
          message: 'hello world',
        });
        //! Jason- Now we need to write the data and stringify it so that it can be sent.
        response.write(JSON.stringify({ content: cowsayResponse }));
        //! Jason- Now we will log a 200 and tell the world that this is a JSON Document
        logger.log(logger.INFO, 'Status:200 We have a JSON docMOOment');
        //! Jason- Now that we are happy with all of our stuff being where we want it we send it.
        response.end();
        //! Jason- Keeping the function happy one undefined at a time.
        return undefined;
      }
      //! Jason- This is basically the same logic as above but handles the parsed request not
      // having a body.
      if (parsedRequest.method === 'POST' && parsedRequest.url === '/api/cowsay' && !parsedRequest.body) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ error: 'invalid request: body required' }));
        logger.log(logger.ERROR, 'Status:400 Body Required');

        response.end();
        return undefined;
      }
      //! Jason- This is basically the same logic as above but handles the parsed request not
      // having text.
      if (parsedRequest.method === 'POST' && parsedRequest.url === '/api/cowsay' && !parsedRequest.body.text) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ error: 'invalid request: body.text required' }));
        logger.log(logger.ERROR, 'Status:400 Text Required');

        response.end();
        return undefined;
        //! Jason- Handles anthing else that the server receives as a request and tells user that
        // doesn't exist.
      } 
      logger.log(logger.INFO, 'Responding with a 404 Status code : NOT FOUND');
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.write('Not Found');

      response.end();
      return undefined;
    })
    //! Jason- I don't actually think that this will ever happen.
    .catch(() => {
      logger.log(logger.INFO, 'Status: 400');
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.write('Bad Request');

      response.end();
      return undefined;
    });
});
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
