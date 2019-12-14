import fs from 'fs';

function listFiles() {
  return fs.readdirSync(process.env.UPLOAD_PATH)
    .filter(f => f.endsWith(".JPG"));
}

function deleteFile(filePath) {
  fs.unlink(process.env.UPLOAD_PATH + filePath, function (err) {
    if (err) throw err;
  });
}

async function uploadFile(files) {
  var oldpath = files.filetoupload.path;
  var newpath = process.env.UPLOAD_PATH + files.filetoupload.name;
  var storagePath = process.env.STORAGE_PATH + files.filetoupload.name;
  fs.rename(oldpath, newpath, function (err) {
    if (err) throw err;
    fs.copyFile(newpath, storagePath, (err) => {
      if (err) throw err;
      fs.unlink(newpath, (err) => {
        if (err) throw err;
      });
    });
  });
}

const file = {
  list: listFiles,
  delete: deleteFile,
  upload: uploadFile
}

export default file;