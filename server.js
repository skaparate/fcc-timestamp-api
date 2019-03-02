// server.js
// where your node app starts

// init project
const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');

// http://expressjs.com/en/starter/static-files.html
app.use('/public', express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

router.get('/timestamp/:date_string?', function(req, res) {
  let response = {
    unix: null,
    utc: ''
  };
  if (!req.params.date_string) {
    const date = new Date();
    response.unix = date.getTime();
    response.utc = date.toUTCString();
    res.send(response);
  }
  
  try {
    const date = new Date(req.params.date_string);
    response.utc = date.toUTCString();
    response.unix = date.getTime();
  } catch(e) {
    console.error(e);
    response.utc = 'Invalid Date';
  }
  res.send(response);
});

app.use('/api', cors({
  optionSuccessStatus: 200
}), router);  // some legacy browsers choke on 204

// Respond to not found routes.
app.use(function(req, res, next){
  if(req.method.toLowerCase() === 'options') {
    res.end();
  } else {
    res.status(404).type('txt').send('Not Found');
  }
});

// Error handling
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});