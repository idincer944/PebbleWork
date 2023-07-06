const mongoose = require('mongoose')

function connectToDb(){
    mongoose.connect('mongodb://localhost/cigkoftes-db')
    .then(()=>{console.log('connected')})
    .catch(()=>{console.log('not connected')})
}

module.exports=connectToDb