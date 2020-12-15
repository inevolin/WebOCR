const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const fs = require("fs")
const Tesseract = require('tesseract.js')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}))

app.post('/ocr', (req, res) => {
  try {
    var base = req.body.data;
    Tesseract.recognize(
      base, 'eng', // { logger: m => console.log(m) }
    ).catch((err) => {
      console.error(err)
      res.send('## error 20')
    }).then( data => {
      res.send(data.data.text);
      console.log(data.data.text);
    });
  }
  catch (err) {
    console.log(err)
    res.send('## error 29')
  }
});

app.get('/ocr', (req, res) => {
  res.send('nothing here')
})

app.use(function(req, res) {
  console.error(404, req.url)
  res.status(404)
  res.send('404 not found.')
})

app.use(function(err, req, res, next) {
  console.error(err)
  res.status(500);
  res.send('500 something went wrong')
})

const port = 1523;
const host = '0.0.0.0'; // or localhost
http.listen(port, host, () => {
  console.log(`listening on ${host}:${port}`);
});