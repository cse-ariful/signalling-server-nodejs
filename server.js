const HTTP_PORT = process.env.PORT || 3000;

const { json } = require('express');
const express = require('express');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

//----------------------------------------------------------------------------------------
'use strict';

const { networkInterfaces } = require('os');
getLocalIpAddress = () => {

  const nets = networkInterfaces();
  let results = {};
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }

  }


}

//----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------

const app = express();
const server = app.listen(HTTP_PORT, () => console.log(`Listening on ${HTTP_PORT}`));
app.set('view engine', 'pug');
app.set('views', './');


// ----------------------------------------------------------------------------------------

// Create a server for handling websocket calls
const wss = new WebSocketServer({ server });


let clients = {};

wss.on('connection', function (socket) {
  socket.on('message', function (message) {
    //console.log(message);
    if (message == undefined) return;
    let payload = JSON.parse(message);
    let user = payload.user;
    if (user == undefined) {
      console.log("undefined user ignoring message");
      return;
    }
    console.log("message Recieved  from " + socket.userId + " sending to " + payload.user + " type " + payload.type);
    if (payload.type.toLowerCase() == "new user") {
      socket.userId = user;
      console.log("User registered " + user);
    } else {
      wss.broadcast(user, payload);
    }

  });
  socket.on('error', function (e) { });
});
const getUserSocket = (set, cb) => {
  for (const e of set) {
    if (cb(e)) {
      return e;
    }
  }
  return undefined;
}
wss.broadcast = function (user, data) {
  //console.log("send message to  " + user);
  let messageToSend = JSON.stringify(data);

  let client = getUserSocket(this.clients, (e => e.userId != user));

  if (client != undefined) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("sending message to " + client.userId + " type -> " + data.type);
      client.send(messageToSend);
      //client.send(JSON.stringify(data));
    }
  }

};

console.log('Server running. Visit https://' + getLocalIpAddress() + ":" + HTTP_PORT + '.\n\n');
