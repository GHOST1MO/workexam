const { randomInt } = require('crypto');
var db = require('./db');
var req
exports.logIn = (username, password,callback)=>{
  db.query(`SELECT * FROM nodejsexam.user where username='${username}' and password = '${password}';`,callback);
}
exports.createUserToken = (username,token,callback)=>{
  db.query(`INSERT INTO nodejsexam.token VALUES ('${token}', '${username}');`,callback);
}

exports.checkUserToken = (token,callback)=>{
  db.query(`SELECT * FROM nodejsexam.token where token='${token}';`,callback);
}
exports.getDirContent = (username, path,callback)=>{
  db.query(`Select * from nodejsexam.directory inner join nodejsexam.dirprivilege on directory.dir_id = dirprivilege.dir_id where dirprivilege.username = '${username}' and directory.parent_path = '${path}'`,callback);
}
exports.checkDirPrivilege = (username, dirName,path,callback)=>{
  db.query(`Select * from nodejsexam.directory inner join nodejsexam.dirprivilege on directory.dir_id = dirprivilege.dir_id where dirprivilege.username = '${username}' and directory.parent_path = '${path}' and name = '${dirName}'`,callback);
}
exports.deletePrivilege = (dirId,callback)=>{
  db.query(`DELETE FROM nodejsexam.dirprivilege WHERE dir_id = ${dirId}`,callback);
}

exports.deleteDir = (dirId,callback)=>{
  db.query(`DELETE FROM nodejsexam.directory WHERE dir_id = ${dirId}`,callback);
}

exports.addDirPrivilege = (username,dirId,callback)=>{
  db.query(`INSERT INTO nodejsexam.dirprivilege (username, dir_id) VALUES ('${username}', '${dirId}');`,callback);
}

exports.addDir = (parentPath,dirName,callback)=>{
  db.query(`INSERT INTO nodejsexam.directory (parent_path, name) VALUES ('${parentPath}', '${dirName}');`,callback);
}
exports.getDirID= (parentPath,dirName,callback) =>{
  db.query(`SELECT * FROM nodejsexam.directory WHERE parent_path='${parentPath}' and name = '${dirName}';`,callback);
}



