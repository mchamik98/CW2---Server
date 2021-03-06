

const express = require("express");
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
const app = express();
var path = require("path");
var fs = require("fs");


app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

app.get("/", (req, res) => {
    res.json({ message: "Choose collection /collection/lessons" });
  });


app.use(function(req, res, next) {
    var filePath = path.join(__dirname, "img", req.url);
    console.log('looking for file at: '+filePath);
      fs.stat(filePath, function(err, fileInfo) {
        if (err) {
          next();
            return;
          }
          if (fileInfo.isFile()){
            res.sendFile(filePath);
            console.log('file found')}
          else
            next();
      });
  
    });
    app.use(function(req, res,next) {
      console.log("file not found")
      next();
      });
  


let db;
MongoClient.connect('mongodb+srv://Hoszajbakurlak:6NKw5VMSezvA@cluster0.mntmf.mongodb.net/test', (err, client) => {
  db = client.db('webstore')
  const ObjectID = require('mongodb').ObjectID;

  app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
  })
 
  app.use(function(request, response, next) {
    console.log("Incoming " + request.method + " method to " + request.url);
    next();
  });
  
  
  app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
      if (e) return next(e)
        res.send(results)
    })
  });
  app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insertOne(req.body, (e, results) => {
    if (e) return next(e)
      res.send(results)
    })  
  });
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});