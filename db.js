var mysql = require('mysql');




exports.query = (sql,callback)=>{
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(sql, function (err, result) {
      if (err) throw err;
      callback(result);

});
  });
}



