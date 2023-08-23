var http = require('http')
var url = require('url')
var qs = require('querystring')
var db = require('./db')

http.createServer(function (req, res) {
    
    var q = url.parse(req.url,true)
    var id = q.query.id

    res.setHeader('Content-Type', 'application/json')

    var path = q.pathname

    if (path == '/products' && req.method==='GET') {
        if(id === undefined){
            //list product
            let sql = "SELECT * FROM products";
            db.query(sql,(err, result) => {
                if (err) throw err;
                
                res.end(JSON.stringify(result));
                
            });
        }else if(id > 0){
            let sql = "SELECT * FROM products where id = "+ id;
            
            db.query(sql,(err, result) => {
                if (err) throw err;
                
                var product = result[0];
                if (product === undefined) {
                    res.end(JSON.stringify({
                            'status' : 404,
                            'message' : 'Data tidak ditemukan'
                    }));
                }
                res.end(JSON.stringify(product));
                
            });
        }
    } else if(path == "/products" && req.method === "POST"){
        var body = ''

        req.on('data',function(data){
            body += data
            if (body.length > 1e6) {
                req.connection.destroy()
            }
        })

        req.on('end',function(){
            var postData = qs.parse(body)
            let name = postData.name
            let price = postData.price

            let sql = `insert into products (name,price) values ('${name}','${price}')`

            db.query(sql, (err, result) => {
                if (err) throw err;

                if (result.affectedRows==1) {
                    res.end(JSON.stringify({'message': 'success'}))
                } else{
                    res.end(JSON.stringify({message: 'gagal'}));
                }
            })
        })
        
    } else if(path == "/products" && req.method === "PUT"){
        //update product    
        
    }else if(path == "/products" && req.method === "DELETE"){
        //delete product    
    }else if (path == '/') {
    res.end('Tes node js lur')
    }



}).listen(8000)

console.log("Server running on http://localhost:8000")
console.log("Or use ip http://127.0.0.1:8000")

