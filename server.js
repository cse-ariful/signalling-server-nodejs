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


let users = {};

wss.on('connection', function (socket) {
  socket.is_alive = true;
  socket.on('pong', () => { socket.is_alive = true; });
  socket.on('message', function (message) {
    //console.log(message);
    if (message == undefined) return;
    let payload = JSON.parse(message);
    console.log("message Recieved  from " + socket.userId + " sending to " + payload.user + " type " + payload.type);
    let type = payload.type.toLowerCase();
    switch (type) {
      case "new user":
        if (payload.user === undefined || payload.message.name === undefined) {
          socket.send(JSON.stringify({ "type": "info", "message": "please set user and message with name for registering user" }));
          break;
        }
        socket.userId = payload.user;
        let userobj = {};
        userobj.id = payload.user;
        userobj.name = payload.message.name;
        users[payload.user] = userobj;
        console.log("User registered " + JSON.stringify(users));
        socket.send(JSON.stringify({ "type": "info", "message": "user subscribed", "user": userobj }));
        wss.clients.forEach((it => it.send(JSON.stringify({ "type": "user_joined", "message": "A New user joined" }))))
        break;
      case "OFFER":
      case "ANSWER":
      case "ice":
        if (payload.user == null) {
          console.log("target user not set ignoring");
          return;
        }
        wss.broadcast(payload.user, payload);
        break;
      case "active_users":
        console.log("get user list from " + socket.userId);
        socket.send(JSON.stringify(users));
        break;
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
// setInterval(function ping() {
//   Array.from(wss.clients).forEach(function each(client_stream) {
//     if (!client_stream.is_alive) { client_stream.terminate(); return; }
//     client_stream.is_alive = false;
//     client_stream.send(JSON.stringify({ "type": "ping", "message": "Reply with pong if you are active" }));
//   });
// }, 5000);

console.log('Server running. Visit https://' + getLocalIpAddress() + ":" + HTTP_PORT + '.\n\n');
