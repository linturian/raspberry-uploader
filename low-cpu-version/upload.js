var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var static = require('node-static');

var thumbDrive = '/media/pi/0AA7-C1FF';
var file = new static.Server(thumbDrive);


function deleteFile(req, res){
  var deletePath = thumbDrive + req.url.replace("/delete","");
  console.log("Deleting")
  console.log(req.url)
  fs.unlink(deletePath, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    console.log('File deleted!');
    });
  res.writeHead(302, {'Location': '/' });
  res.end();
}

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      console.log(files)
      var oldpath = files.filetoupload.path;
      var newpath = './' + files.filetoupload.name;
      var tmp = thumbDrive + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;

  fs.copyFile(newpath, tmp, (err) => {
    if (err) throw err;
    console.log('source.txt was copied to destination.txt');

   fs.unlink(newpath, (err) => {
     if (err) throw err;
   res.write('File copied to thumbDrive');
   res.end();
   });
 });


      });
 });
  } else if (req.url == '/') {
      console.log("Reading all files @ " + thumbDrive)
      fs.readdir(thumbDrive, function (err, files) {
      //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        res.writeHead(200, {'Content-Type': 'text/html'});
        //listing all files using forEach
        files.forEach(function (currFile) {
            // Do whatever you want to do with the currFile
            // res.write('<a href="' + currFile +'"'+'>'+ currFile+'</a><br/>')
            var localPath = thumbDrive+ currFile
            if (currFile.includes(".jpg") || currFile.includes(".png") || currFile.includes(".jpeg")){
              res.write('<a href="' + localPath +'/delete"><img src="file://' + localPath + '" style="width: 100%">' + '</a>')
              // res.write('<img src="' + localPath +'">')
              res.write('<br/>')
              res.write('<br/>')
              console.log(localPath); 
            }
        });
      res.end();
      console.log("End Reading All Files");
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
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<center><form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<h1>Page_Not_Found</h1>')
    res.write('</form></center>');
  }
}).listen(8080); 