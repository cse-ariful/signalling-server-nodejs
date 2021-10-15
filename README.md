WebRTC signaling server
==============
## Instructions for integrating with heroku

NOTE: I removed https support and made other changes to make this work. Useful resources: https://devcenter.heroku.com/articles/getting-started-with-nodejs, https://devcenter.heroku.com/articles/node-websockets. Based on https://github.com/shubhamchandak94/WebRTC-Example-RTCDataChannel.
- make heroku account and download CLI
- go to project folder and do npm install etc.  
- run `heroku create`
- then run `heroku local web` to test on local machine
- deploy using `git push heroku master` (after any commits)

Currently running on https://vast-earth-73765.herokuapp.com/, allows two connections to signaling server. Note that server goes to sleep after lack of activity, so it might be slower to load. You can see a log of the server activity by running `heroku logs --tail` in the project directory.

The webpage displays the number of websocket connections currently active.

-----
## Usage

The signaling server uses Node.js, `express`, `pug` and `ws` and can be started as such:

```
$ npm install
$ npm start
```

With the server running, open two windows of a recent version of Firefox, Chrome, or Safari and visit https://localhost:3000.

## License

The MIT License (MIT)

Copyright (c) 2019 Shane Tully, Zac Duthie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
