var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var static = require('node-static');

var thumbDrive = '/home/terry/Pictures/';
var file = new static.Server(thumbDrive);


function deleteFile(req, res){
  var deletePath = req.url.replace("/delete","");
  console.log(new Date(),"Deleting", req.url)
  fs.unlink(deletePath, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    console.log(new Date(),'File deleted! - ', deletePath);
    });
  res.writeHead(302, {'Location': '/' });
  res.end();
}

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      console.log(new Date(), files)
      var oldpath = files.filetoupload.path;
      var newpath = './' + files.filetoupload.name;
      var tmp = thumbDrive + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;

  fs.copyFile(newpath, tmp, (err) => {
    if (err) throw err;
    console.log(new Date(),'File was copied to ', thumbDrive);

   fs.unlink(newpath, (err) => {
     if (err) throw err;
   res.write('File copied to thumbDrive');
   res.end();
   });
 });


      });
 });
  } else if (req.url == '/') {
      console.log(new Date(),"Reading all files @ " + thumbDrive)
      fs.readdir(thumbDrive, function (err, files) {
      //handling error
        if (err) {
            return console.log(new Date(),'Unable to scan directory: ' + err);
        } 
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<html>');
        res.write('<head>');
        res.write('<meta http-equiv="content-type" content="text/html; charset=windows-1252">');
        res.write('</head');
        res.write('<body>');
        //listing all files using forEach
        files.forEach(function (currFile) {
            var localPath = thumbDrive+ currFile
            if (currFile.includes(".jpg") || currFile.includes(".png") || currFile.includes(".jpeg")){
              res.write('<a href="' + localPath +'/delete"><img src="' + currFile + '" style="width: 100%">' + '</a>')
              res.write('<br/>')
              res.write('<br/>'); 
            }
        });
        res.write('</body>');
        res.write('</html>');
      res.end();
      console.log(new Date(),"End Reading All Files");
      console.log(new Date())
    })
  } else if (req.url == '/upload') {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<center><form action="fileupload" method="post" enctype="multipart/form-data">');
      res.write('<input type="file" name="filetoupload" style="font-size:5em"><br/><br/><br/><br/>');
      res.write('<input type="submit" style="font-size:5em">');
      res.write('</form></center>');
      return res.end();
  } else if (req.url.includes("delete")) {
        deleteFile(req, res);
  } else {
    console.log(new Date(),"Serving image file" + req.url);
    file.serveFile(req.url, 200, {}, req, res)
  }
}).listen(8080); 