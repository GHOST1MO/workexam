var fs = require('fs');
//var path = require('path');



exports.getFolderContent = (path,callback) => {
  fs.readdir('./folders/'+ path,{ withFileTypes: true },(err,content) =>{
    const files = content.filter(item => item.isFile()).map(file => file.name);
    callback(err,files);
  })
}
exports.deleteFile = (path,callback) => {
  fs.unlink('./folders/'+ path,(err) =>{
    callback(err);
  })
}

exports.deleteDir = (path,callback) => {
  fs.rmdir('./folders/'+ path,(err) =>{
    callback(err);
  })
}
exports.mkDir = (path,callback) => {
  fs.mkdir('./folders/'+ path,(err) =>{
    callback(err);
  })
}

exports.checkDirEmpty = (path,callback) => {
  fs.readdir('./folders/'+ path,(err,data) =>{
    callback(err,data);
  })
}

exports.uploadFile = (path,file,callback)=>{
  var src = fs.createReadStream(file.path);
  var dest = fs.createWriteStream(path+'/'+file.originalname);
  src.pipe(dest);
  src.on('end',()=> callback(false));
  src.on('error',()=>  callback(true));
}

