var mysql = require('mysql');

var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'crud',
});


db.connect(function(err) {
    if (err) throw console.log("Database ga Konek "+err);
    console.log("Database Connected");
});

module.exports = db;
