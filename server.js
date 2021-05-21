'use strict'

const express = require('express');
const pg = require('pg');
const methodoverride = require('method-override');
const cors =require('cors');
const superagent=require('superagent');
require('dotenv').config();

const PORT = process.env.PORT;
const DATABASE_URL=process.env.DATABASE_URL;

const server=express();
const client=new pg.Client(DATABASE_URL);
server.use(express.urlencoded({extended:true}));
server.use(express.static('./public'));
server.use(cors());
server.use(methodoverride('_method'));
server.set('view engine','ejs');



server.get('/',renderall);
server.post('/sendtodb',sendtodb)
server.get('/addtofav',renderfromdb)
server.get('/viewdetail/:id',viewdetail)
server.put('/update/:id',updateinfo)
server.delete('/delete/:id',deleteinfo)


function deleteinfo(req,res){
    const id =req.params.id;
    const sql=`DELETE FROM food WHERE id=$1`
    const safevalue=[id];
    client.query(sql,safevalue).then(() =>{
        res.redirect(`/addtofav`)
    })


}

function updateinfo(req,res){
    const id =req.params.id;
    const {character,image,quote,characterDirection}=req.body;
    const sql =`UPDATE food SET character=$1 , image=$2 , quote=$3 , characterDirection=$4 WHERE id=$5`
    const safevalue = [character,image,quote,characterDirection,id]

    client.query(sql,safevalue).then(() =>{
        res.redirect(`/viewdetail/${id}`)
    })
}


function viewdetail(req,res){
    const id=req.params.id
    const sql =`SELECT * FROM food WHERE id=$1;`
    const safevalue=[id]
    client.query(sql,safevalue).then(data =>{
        res.render('pages/details',{suhaib:data.rows})
    })
}

function renderfromdb(req,res){
    const sql=`SELECT * FROM food;`
    client.query(sql).then(data =>{
        res.render('pages/favrot',{suhaib:data.rows})
    })
}

function sendtodb(req,res){
const {character,image,quote,characterDirection}=req.body;
const sql =`INSERT INTO food(character,image,quote,characterDirection) VALUES($1,$2,$3,$4)`
const safevalue=[character,image,quote,characterDirection]
client.query(sql,safevalue).then(()=>{
    res.redirect('/addtofav')
})

}

function Simpson(info){
    this.character=info.character;
    this.image=info.image;
    this.quote=info.quote;
    this.characterDirection=info.characterDirection;
}

function renderall(req,res){
const url=`https://thesimpsonsquoteapi.glitch.me/quotes?count=10`
superagent.get(url).set('User-Agent', '1.0').then(data =>{
    const simp =data.body.map(result=>{
        return new Simpson(result)
    })
    res.render('pages/home',{suhaib:simp})
})

}


client.connect().then(()=>{
    server.listen(PORT,()=>{
        console.log(`hi ${PORT}`);
    })
})

