const express=require('express')
const app=express()
const dbConnection=require('./db')

const eventRoutes=require('./routes/event')


app.use('/api/event',eventRoutes)


app.listen(3000,()=>{
    console.log('server started at 3001');
    dbConnection()
    
})

app.get('/',(req,res)=>{
    res.send('Hi')
})


// test etmek icin:
// mongodb'yi baslat
// src/ icindeyken "node app.js" komutu kullan
// google de bu iki endpointi dene
//  http://localhost:3000/  'Hi' dondurur
// http://localhost:3000/api/event/getallevents   bos bir event dizisi dondurur