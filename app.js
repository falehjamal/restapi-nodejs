const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db.js')
const app = express()
const PORT = process.env.PORT || 5000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/products',(req,res)=>{
    const data = {...req.body};
    const sql = "insert into products set ?";
 

    db.query(sql,data,(err,rows,field)=>{
        if(err){
            return res.status(500).json({error:err,msg : 'gagal insert data'});
        }
        res.status(201).json({success:true,msg:'berhasil insert data'});
    });

});

app.get('/products',(req,res)=>{
    const sql = "select * from products";
    const id = req.query.id;

    // res.end(id);

    if(id === undefined){
        db.query(sql,(err,rows,field)=>{
            if (err) {
                return res.status(500).json({ error: err,msg: 'Ada kesalahan' });
            }

            res.status(200).json({success:true,data:rows});
        });
    }else{
        db.query("select * from products where id="+id,(err,rows,field)=>{
            if (err) {
                return res.status(500).json({ error: err,msg: 'Ada kesalahan' });
            }

            res.status(200).json({success:true,data:rows});
        });
    }

});

app.put('/products/:id',(req,res)=>{
    const data = {...req.body};
    const cari = "select * from products where id = ?";
    const sql = "update products set ? where id = ?";


    db.query(cari,req.params.id,(err,rows,field)=>{
        // res.end(rows.lenght)
        if(err){
            return res.status(500).json({error:err,msg:"terjadi galat server"});
        }

        if (rows.length) {
            db.query(sql,[data,req.params.id],(err, rows, field)=>{
            if(err){
                return res.status(500).json({
                    error:err,
                    msg:"terjadi galat server"
                });   
            }
            return res.status(200).json({
                success:true,
                msg:"data berhasil di update",
                data:[data,{id:req.params.id}]
            });
            });   
        }else{
            return res.status(404).json({
                success:false,
                msg:"Data tidak ditemukan"
            });
        }
    
    });
});

app.delete('/products/:id',(req,res)=>{
    const data = {...req.body};
    const cari = "select * from products where id = ?";
    const sql = "delete from products where id = ?";


    db.query(cari,req.params.id,(err,rows,field)=>{
        // res.end(rows.lenght)
        if(err){
            return res.status(500).json({error:err,msg:"terjadi galat server"});
        }

        if (rows.length) {
            db.query(sql,req.params.id,(err, rows, field)=>{
            if(err){
                return res.status(500).json({
                    error:err,
                    msg:"terjadi galat server"
                });   
            }
            return res.status(200).json({
                success:true,
                msg:"data berhasil di hapus",
                data:[data,{id:req.params.id}]
            });
            });   
        }else{
            return res.status(404).json({
                success:false,
                msg:"Data tidak ditemukan"
            });
        }
    
    });
});




app.listen(PORT,() => console.log(`Server running at port: ${PORT}`));
