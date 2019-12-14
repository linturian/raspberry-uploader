import file from '../functions/file';

var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');

router.get('/', function (req, res, next) {
  const files = file.list();
  res.render('index', { files: files });
});

router.get('/delete/:filePath', function (req, res, next) {
  file.delete(req.params['filePath']);
  res.redirect('/');
});

router.post('/', function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    file.upload(files)
    .then(res.redirect('/'))
    .catch(err=>console.error(err));
  });
});




module.exports = router;
