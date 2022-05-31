// our packages utilizing express to build our API's
const express = require('express') 
const app = express() // the variable app is set equal to when express is called 
const bodyParser = require('body-parser') // look inside any of the requests we have sent to the server - somewhat deprecated now b/c of express has this built in 
//bodyParser = think of converter 
const MongoClient = require('mongodb').MongoClient // MongoClient what we used to talk to Mongodb 

var db, collection; //variable db and why is collection there? - it's there cuz it's old school, don't need

// const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true"; //const url = variable and link to your db username and password

const url = 'mongodb+srv://mawong2:eVUa3qBDYCkoNjyi@cluster0.3xblz.mongodb.net/?retryWrites=true&w=majority'
const dbName = "demo"; //db name 
// make sure to whitelist your IP address o the mongoDB - network access - add IP adress and "whitelist" AKA "0.0.0.0"

app.listen(3000, () => { // this block of code is to connect to mongodb 
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) { // 
            throw error;
        }
        db = client.db(dbName); //we're setting the db global variable to the client we're utilizing the db method? to get to the client name 
        console.log("Connected to `" + dbName + "`!");
    })
});

app.set('view engine', 'ejs') //we are utilizing EJS as our templating language 
app.use(bodyParser.urlencoded({extended: true})) // we can look at what is coming in as part of the request
app.use(bodyParser.json())
app.use(express.static('public')) //setting up our public folder - putting all of the static files such as HTML and CSS (things that doesn't change) - we have a chocolate cake with diff types of frosting on top 

app.get('/', (req, res) => { // retrieves a request
  db.collection('messages').find().toArray((err, result) => { //we're going to going to the db, then we find the result, and turn it into an array and utilize the arrow function - whenever you see the result = all the data we grabbed from mongoDB
    if (err) return console.log(err) // tells us if we have an error 
    res.render('index.ejs', {messages: result}) // EJS = an HTML template we can mess around with // we plug in the array of messages we found from the data base {messages: result} - then we respond with html - result = our array 

    //we are returning HTML via EJS 
    //.render is a method built in a feature of express
  })
})
// get and post work in tandem w/ each other

app.post('/messages', (req, res) => { //name - creates stuff in the db
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => { // we're inserting a document (object) w/ the properties of name, msg, etc. 
    //thumbUp and thumbDown are set to 0 b/c that's many likes or dislikes they are starting out with
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/') //refreshing 
  })
})

app.put('/messages', (req, res) => { //updates stuff in db
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, { //find whatever was clicked to update it
  // body is referencing the body of your object 
    $set: {
      thumbUp:req.body.thumbUp + 1,
       //this is for the likes and not the msgs
      // thumbDown:req.body.thumbDown - 1
    }
  }, {
    sort: {_id: -1}, // tells us which order to read the list 
    // we're sorting this in descending order after we updated it 
    upsert: true //definition is if we can't find the document, then make a new one - and you don't want this b/c that means your query is wrong - you'd want to change this to false - you'd probably want to do something in the post 
    // upsert = self healing mechanism = we will create it for you if we can't find it 
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/messagesDown', (req, res) => { 
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, { 
    $set: {
      thumbUp:req.body.thumbUp - 1
    }
  }, {
    sort: {_id: - 1}, 
    upsert: true 
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})


