'use strict';

var express = require('express');
var fileUpload = require('express-fileupload')
var cors = require('cors');
var bodyParser = require('body-parser')

// require and use "multer"...

var app = express();

app.use(fileUpload({
  createParentPath: true
}))

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', async function(req, res) {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      })
    } else {
      let uploadedFile = req.files.upfile
      uploadedFile.mv(`./uploads/${uploadedFile.name}`)
      console.log('File uploaded...')

      res.send({
        name: uploadedFile.name,
        mimetype: uploadedFile.mimetype,
        size: uploadedFile.size
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log(`Node.js listening on port ${process.env.PORT || 3000}...`);
});
