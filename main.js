var url = require('url');
var user = require('./user');
var fs = require('./fileSystem');
var express = require('express');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var multer  = require('multer')
var upload = multer({ dest: 'upload/'});


var app = express();
app.use(cookieParser());
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var type = upload.single('file');
function makeToken(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
//DONE
app.post('/login',urlencodedParser, function (req, respons) {
  user.logIn(req.body.username,req.body.password,(presult) => {
    if(presult.length > 0){
      var token = makeToken(16);
      user.createUserToken(req.body.username,token,(result)=>{
        if (result.affectedRows){
          respons.cookie('Token', token);
          return respons.end(JSON.stringify({Done:"you have been loged in"}));
        }else
          return respons.end(JSON.stringify({err:"Cannot create session"}));

      });
    }
    else {
      return respons.end(JSON.stringify({err:"Error in your information"}));
    }
    
  });

})
//DONE
app.get('/getDirContent', function (req, respons) {
  user.checkUserToken(req.cookies.Token,(result) => {
    if (!result.length) return respons.end(JSON.stringify({err:"Token not found"}));
    var path;
    if ((req.query.path.match(new RegExp("/", "g")||[]).length) > 1){
      path = req.query.path.substring(0,req.query.path.lastIndexOf("/"));
    }
    else{
      path = '/';
    }
    user.checkDirPrivilege(result[0].username,req.query.path.substring(req.query.path.lastIndexOf("/")+1),path,(inResult) => {
      if (!inResult.length && req.query.path != '/') return respons.end(JSON.stringify({err:"The path does not exist"}));
      fs.getFolderContent(req.query.path,(err,data)=>{
        if (err) return respons.end(JSON.stringify(err));
        user.getDirContent(result[0].username,req.query.path,(inResult) => {
          var x = inResult.map((item)=>{return item.name});
          if(data != undefined) 
          x = [...x,...data];
          console.log(x);
          console.log("start",req.query.start-1);
          console.log("end",parseInt(req.query.start)-1+parseInt(req.query.count));
          return respons.end(JSON.stringify(x.slice(req.query.start-1,parseInt(req.query.start)-1+parseInt(req.query.count))));
        });
      });
    });
  });
});

//DONE
app.post('/UploadFile',type, function (req, respons) {
  user.checkUserToken(req.cookies.Token,(result) => {
    if (!result.length) return respons.end(JSON.stringify({err:"Token not found"}));
    var path;
    if ((req.body.path.match(new RegExp("/", "g")||[]).length) > 1){
      path = req.body.path.substring(0,req.body.path.lastIndexOf("/"));
    }
    else{
      path = '/';
    }
    user.checkDirPrivilege(result[0].username,req.body.path.substring(req.body.path.lastIndexOf("/")+1),path,(inResult) => {
      if (!inResult.length && req.query.path != '/') return respons.end(JSON.stringify({err:"The path does not exist"}));
      if(!req.file) {
        return respons.end(JSON.stringify({err:'No file uploaded'}));
      }
      else {
        fs.uploadFile('./folders'+req.body.path,req.file,(err)=>{
          if (err) return respons.end(JSON.stringify({err:'No file uploaded'}));
          return respons.end(JSON.stringify({Done:"The file "+req.file.originalname+ "has been uploaded."}));
        });
      }
    });
  });
});
//DONE
app.delete('/deleteFile', function (req, respons) {
  user.checkUserToken(req.cookies.Token,(result) => {
    if (!result.length) return respons.end(JSON.stringify({err:"Token not found"}));
    var folderName,path;
    if ((req.query.path.match(new RegExp("/", "g")||[]).length) > 1){
      path = req.query.path.substring(0,req.query.path.lastIndexOf("/"));
      folderName =req.query.path.substring(req.query.path.lastIndexOf("/")+1);  
      console.log("OK");
    }
    else{
      console.log("No");
      path = '/';
      folderName =req.query.path.substring(1);  
    }

    user.checkDirPrivilege(result[0].username,folderName,path,(inResult) => {
      if (!inResult.length) return  respons.end(JSON.stringify({err:"The file does not exist"}));
      fs.deleteFile(req.query.path+'/'+req.query.fileName,(err)=>{
        if (err) return respons.end(JSON.stringify(err));
        return respons.end(JSON.stringify({Done:"The file "+req.query.path+ "has been deleted."}));
      })
    });
  });
})
//DONE
app.delete('/deleteDir', function (req, respons) {
  user.checkUserToken(req.cookies.Token,(result) => {
    if (!result.length) returnrespons.end(JSON.stringify({err:"Token not found"}));
    user.checkDirPrivilege(result[0].username,req.query.dirName,req.query.path,(inResult) => {
      if (!inResult.length || (req.query.path == '/'? '':'/')+'/'+req.query.dirName == '/'+ result[0].username) return  respons.end(JSON.stringify({err:"The path does not exist"}));
      console.log(req.query.path+'/'+req.query.dirName == '/'+ result[0].username);
      console.log('/'+ result[0].username);
      console.log(req.query.path+'/'+req.query.dirName);
      fs.checkDirEmpty(req.query.path+"/"+req.query.dirName,(err,data)=>{
        if (err) respons.end(JSON.stringify(err));
        if(data.length) return respons.end(JSON.stringify({err:"The dir is not empty"}));
        user.deletePrivilege(inResult[0].dir_id,()=>{
          user.deleteDir(inResult[0].dir_id,()=>{
            fs.deleteDir(req.query.path+"/"+req.query.dirName,(err)=>{
              return respons.end(JSON.stringify({Done:"The dir "+req.query.dirName+ "has been deleted."}));
            })
          })
        }) 
      })
     
      
    })
    
  });
})
//DONE
app.put('/mkDir', function (req, respons) {
  user.checkUserToken(req.cookies.Token,(result) => {
    if (!result.length) return respons.end(JSON.stringify({err:"Token not found"}));
    var username = result[0].username;
    var path;
    if ((req.query.path.match(new RegExp("/", "g")||[]).length) > 1){
      path = req.query.path.substring(0,req.query.path.lastIndexOf("/"));
    }
    else{
      path = '/';
    }
    user.checkDirPrivilege(result[0].username,req.query.path.substring(req.query.path.lastIndexOf("/")+1),path,(inResult) => {
      if (!inResult.length && req.query.path != '/') return respons.end(JSON.stringify({err:"The path does not exist"}));
      fs.mkDir(req.query.path+"/"+req.query.dirName,(err)=>{
        if (err) return respons.end(JSON.stringify(err));
        user.addDir(req.query.path,req.query.dirName,(result)=>{
          user.getDirID(req.query.path,req.query.dirName,(result)=>{
            user.addDirPrivilege(username,result[0].dir_id,(result)=>{
              if (err) return respons.end(JSON.stringify(err));
              return respons.end(JSON.stringify({Done:"The folder has been created."}));
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
    if (!result.length) return respons.end(JSON.stringify({err:"Token not found"}));
    var username = result[0].username;
    var path;
    if ((req.body.path.match(new RegExp("/", "g")||[]).length) > 1){
      path = req.body.path.substring(0,req.body.path.lastIndexOf("/"));
    }
    else{
      path = '/';
    }
    user.checkDirPrivilege(result[0].username,req.body.path.substring(req.body.path.lastIndexOf("/")+1),path,(inResult) => {
      if (!inResult.length && req.query.path != '/') return respons.end(JSON.stringify({err:"The path does not exist"}));
      
    })
  });
});