var url = require('url');
var user = require('./user');
var fs = require('./fileSystem');
var express = require('express');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var multer  = require('multer')
var upload = multer();


var app = express();
app.use(cookieParser());
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(upload.array('files')); 
function makeToken(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
app.post('/login',urlencodedParser, function (req, respons) {
  user.logIn(req.body.username,req.body.password,(presult) => {
    console.log(req.body);
    if(presult.length > 0){
      var token = makeToken(16);
      user.createUserToken(req.body.username,token,(result)=>{
        if (result.affectedRows)
          respons.cookie('Token', token);
          respons.end();
      });
    }
    
  });

})
app.get('/getDirContent', function (req, respons) {
  user.checkUserToken(req.cookies.Token,(result) => {
    if (!result.length) respons.end(JSON.stringify({err:"Token not found"}));
    fs.getFolderContent(result[0].username+req.query.path,(err,data)=>{
      if (err) respons.end(JSON.stringify(err));
      user.getDirContent(result[0].username,req.query.path,(inResult) => {
        var x = inResult.map((item)=>{return item.name});

        respons.end(JSON.stringify([...data,...x].slice(req.query.start,req.query.end)));
      })
    })
  });
});
app.post('/UploadFile',urlencodedParser, function (req, respons) {
  user.checkUserToken(req.cookies.Token,(result) => {
    console.log(req.files);
    if (!result.length) respons.end(JSON.stringify({err:"Token not found"}));
    if(!req.files) {
      respons.end(JSON.stringify({err:'No file uploaded'}));
  }
    else {
      fs.uploadFile(req.body.path,req.files.file,()=>{
        respons.end(JSON.stringify({Done:"The file "+req.files.file.name+ "has been uploaded."}));
      });
    }
  });

});

app.delete('/deleteFile', function (req, respons) {
  user.checkUserToken(req.cookies.Token,(result) => {
    if (!result.length) respons.end(JSON.stringify({err:"Token not found"}));
    fs.deleteFile(req.query.path,(err)=>{
      if (err) respons.end(JSON.stringify(err));
      respons.end(JSON.stringify({Done:"The file "+req.query.path+ "has been deleted."}));
    })
  });
})

app.delete('/deleteDir', function (req, respons) {
  user.checkUserToken(req.cookies.Token,(result) => {
    if (!result.length) respons.end(JSON.stringify({err:"Token not found"}));
    user.checkDirPrivilege(result[0].username,req.query.dirName,req.query.path,(inResult) => {
      fs.checkDirEmpty(req.query.path+"/"+req.query.dirName,(err,data)=>{
        if (err) respons.end(JSON.stringify(err));
        if(data.length) respons.end(JSON.stringify({err:"The dir is not empty"}));
        user.deletePrivilege(inResult[0].dir_id,()=>{
          user.deleteDir(inResult[0].dir_id,()=>{
            fs.deleteDir(req.query.path+"/"+req.query.dirName,(err)=>{
              respons.end(JSON.stringify({Done:"The dir "+req.query.dirName+ "has been deleted."}));

            })
          })
        }) 
      })
     
      
    })
    
  });
})

app.put('/mkDir', function (req, respons) {
  user.checkUserToken(req.cookies.Token,(result) => {
    if (!result.length) respons.end(JSON.stringify({err:"Token not found"}));
    var username = result[0].username;
    user.checkDirPrivilege(result[0].username,req.query.path.substring(req.query.path.lastIndexOf("/")+1),req.query.path.substring(0,req.query.path.lastIndexOf("/")+1),(inResult) => {
      if (!inResult.length) respons.end(JSON.stringify({err:"The dir does not exist"}));
      fs.mkDir(req.query.path+"/"+req.query.dirName,(err)=>{
        if (err) respons.end(JSON.stringify(err));
        user.addDir(req.query.path,req.query.dirName,(result)=>{
          user.getDirID(req.query.path,req.query.dirName,(result)=>{
            user.addDirPrivilege(username,result[0].dir_id,(result)=>{
              if (err) respons.end(JSON.stringify(err));
              respons.end(JSON.stringify({Done:"The folder has been created."}));
            }) 
          })
        })
      });
    })
  });
});




var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("app listening at http://%s:%s", host, port)
})


app.get('/search', function (req, respons) {
  user.checkUserToken(req.cookies.Token,(result) => {
    if (!result.length) respons.end(JSON.stringify({err:"Token not found"}));
    var username = result[0].username;
    user.checkDirPrivilege(result[0].username,req.query.path.substring(req.query.path.lastIndexOf("/")+1),req.query.path.substring(0,req.query.path.lastIndexOf("/")+1),(inResult) => {
      if (!inResult.length) respons.end(JSON.stringify({err:"The dir does not exist"}));
      
    })
  });
});