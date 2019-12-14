var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');

/* GET home page. */
router.get('/', function (req, res, next) {
  files = listFiles()
  res.render('index', { files: files });
});

router.get('/delete/:filePath', function (req, res, next) {
  deleteFile(req.params['filePath']);
  res.redirect('/');
});

router.post('/', function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    console.log(files)
    var oldpath = files.filetoupload.path;
    var newpath = './' + files.filetoupload.name;
    // var thumbDrive = '/media/pi/0AA7-C1FF/' + files.filetoupload.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;

      // fs.copyFile(newpath, thumbDrive, (err) => {
      //   if (err) throw err;
      //   console.log('source.txt was copied to destination.txt');

        // fs.unlink(newpath, (err) => {
        //   if (err) throw err;
        //   console.log('File copied to thumbDrive');
          res.redirect('/');
        // });
      // });
    });
  });
});

function listFiles() {
  return fs.readdirSync('.').filter(f => f.endsWith(".JPG"));
}

function deleteFile(filePath) {
  fs.unlink(filePath, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    console.log('File deleted!');
  });
}

module.exports = router;
