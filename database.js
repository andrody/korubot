const mongoose = require('mongoose')
const Charge = require('./models/Charge')

mongoose.connect('mongodb://sa:ko12345@ds121183.mlab.com:21183/korujinha', { useNewUrlParser: true })

// var MongoClient = require("mongodb").MongoClient
// var url = "mongodb://sa:ko12345@ds121183.mlab.com:21183/korujinha"

// MongoClient.connect(url, function(err, db) {
//     if (!err) {
//         console.log("Connected successfully to server");
//         db.close();
//     } else {
//         console.log(err)
//     }
  
//   });