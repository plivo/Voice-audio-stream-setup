const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const url = require('url');
const path = require('path');
const fs = require('fs');

const xmlFilePath = path.join(__dirname, 'stream.xml');

const app = express();

// Create HTTP server
const server = http.createServer((req, res) => {
  // Parse the URL to extract query parameters
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Log incoming request method and URL
  console.log(`Received ${req.method} request for ${parsedUrl.pathname}`);

  // Log query parameters (if any)
  if (parsedUrl.query) {
    console.log('Query parameters:', parsedUrl.query);
  }

  // Check request method
  if (req.method === 'POST') {
    // `Handle POST request
    const currentTime = new Date();
    // Print the current time
    console.log(currentTime);
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log('Received POST data:', body);
      // Send XML response
      res.writeHead(200, { 'Content-Type': 'application/xml' });
    });
  } else {
    console.log('Received GET data:');
    // Handle POST request
    const currentTime = new Date();
    // Print the current time
    console.log(currentTime);
    // Read XML file asynchronously
    fs.readFile(xmlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading XML file:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    } else {
      // Set response headers
      res.writeHead(200, { 'Content-Type': 'application/xml' });
      // Send XML response from file
      res.end(data);
    }
  });
  }
});
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
  //const clientIp = req.socket.remoteAddress;
  let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log("socket: client connected from IP ", clientIp);

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    switch (parsedMessage.event) {
      case "start":
        console.log(`A new call has connected.`);
        break;

      case "media":
          // Prepare the response message
          const responseMessage = {
            event: "playAudio",
            media: {
              contentType: "audio/x-mulaw",
              sampleRate: 8000,
              payload: parsedMessage.media.payload // Sending back the same payload
            }
          };

          // Send the response back to the same client
          ws.send(JSON.stringify(responseMessage));

        break;
      case "stop":
        console.log(`Call Has Ended`);
        break;
    }
  });

  ws.on("close", () => {
    console.log("socket: client disconnected");
    recognizeStream.destroy();
  });
});



server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
