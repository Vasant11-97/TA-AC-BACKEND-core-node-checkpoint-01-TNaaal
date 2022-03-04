var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');

var contact = path.join(__dirname, './contact.html');

var contactDir = path.join(__dirname, '../contacts/');
console.log(contactDir);

var server = http.createServer(handleRequest);

function handleRequest(req, res) {
  var store = '';
  req.on('data', (chunk) => {
    store += chunk;
  });

  console.log(req.method, req.url);

  req.on('end', () => {
    //   Route for index page
    if (req.method === 'GET' && req.url === '/') {
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('index.html').pipe(res);
    }

    // Route for about page
    if (req.method === 'GET' && req.url === '/about') {
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('about.html').pipe(res);
    }

    // Route for css file

    if (req.method === 'GET' && req.url.split('.').pop() === 'css') {
      res.setHeader('Content-Type', 'text/css');
      fs.createReadStream(__dirname + '/stylesheet/style.css').pipe(res);
    }

    var img = path.join(__dirname, '../assets/');
    //! handel routes for images in assets folder
    if (
      req.url.split('.').pop() === 'png' ||
      req.url.split('.').pop() === 'jpg'
    ) {
      //* set header for image file
      res.setHeader('Content-Type', `image/png`);
      // //* read the image send to response
      fs.createReadStream( img + 'index.png').pipe(res);
    }

    if (req.method === 'POST' && req.url === '/form') {
      let parsedData = qs.parse(store);
      let userName = parsedData.username;
      fs.open(contactDir + userName + '.json', 'wx', (err, fd) => {
        console.log(err);
        fs.writeFile(fd, JSON.stringify(qs.parse(store)), 'utf-8', (err) => {
          console.log(err);
          fs.close(fd, (err) => {
            console.log(err);
            res.end(`${userName} added successfully`);
          });
        });
      });
    }

    if (req.method === 'GET' && req.url === '/contact') {
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('contact.html').pipe(res);
    }
  });
}

server.listen(5000, () => {
  console.log('Server is listening on port 5k');
});
