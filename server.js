//http://hp-api.herokuapp.com/api/character

const express=require('express')
const pg=require('pg');
const superagent=require('superagent')
const cors=require('cors')
const methodoverride=require('method-override')

require('dotenv').config();
const PORT=process.env.PORT;
const DATABASE_URL= process.env.DATABASE_URL;

const app=express();
const client =new pg.Client(DATABASE_URL)
app.use(express.urlencoded({extended:true}))
app.use(express.static('./public'))
app.use(methodoverride('_method'))
app.use(cors());
app.set('view engine','ejs')

app.get('/',renderall)
app.post('/saveDataBASE',saveInDB)
app.get('/renderfromdb',renderdb)
app.get('/viewdetails/:id',deatils)
app.put('/updatechr/:id',updatechar)
app.delete('/deletechr/:id',deletechr)

function deletechr(req,res){
const id=req.params.id;
const safevalue=[id];
const sql=`DELETE FROM harry WHERE id=$1`
client.query(sql,safevalue).then(()=>{
    res.redirect('/renderfromdb')
})

}

function updatechar (req,res){
    const {name,image,house,alive}=req.body
    const id = req.params.id
    const sql=`UPDATE harry SET name=$1 ,image=$2 , house=$3 , alive=$4 WHERE id=$5 `
    const safevalue=[name,image,house,alive,id]
    client.query(sql,safevalue).then(()=>{
        res.redirect(`/viewdetails/${id}`)
    })
}

function deatils(req,res){
    const id=req.params.id;
    const sql =`SELECT * FROM harry WHERE id=$1`
    const safevalue=[id]
    client.query(sql,safevalue).then(data =>{
        res.render('pages/details',{suhaib:data.rows})
    })

}

function renderdb(req,res){
    const sql=`SELECT * FROM harry;`
    client.query(sql).then(data=>{
        res.render('pages/favrot',{suhaib:data.rows})
    })
}

function saveInDB(req,res){
    const {name,image,house,alive}=req.body
    const sql=`INSERT INTO harry(name,image,house,alive) VALUES($1,$2,$3,$4) `
    const safevalue=[name,image,house,alive]
    client.query(sql,safevalue).then(()=>{
        res.redirect('/renderfromdb')
    })
}

function Potter(info){
    this.name=info.name;
    this.image=info.image;
    this.house=info.house;
    this.alive=info.alive;
}

function renderall(req,res){

    const url=`http://hp-api.herokuapp.com/api/characters`
    superagent.get(url).then(data =>{
        const hp =data.body.map(result =>{
            return new Potter(result)
        })
        res.render('pages/home',{suhaib:hp})
    })
}

client.connect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`hi ${PORT}`);
    })
})


