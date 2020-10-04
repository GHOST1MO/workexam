var fs = require('fs');
//var path = require('path');



exports.getFolderContent = (path,callback) => {
  fs.readdir('./folders/'+ path,(err,files) =>{
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
  let avatar = req.files.avatar;
      
  avatar.mv('./folders/' +path+"/"+ avatar.name);
}

