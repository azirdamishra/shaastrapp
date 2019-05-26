var express=require('express');
var bodyParser=require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(){
    console.log("connection succeeded");
});

var app=express();


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/sign_up', function(req,res){
    if(!req.body.email) {
        return res.send(400, { message: 'Missing email'})
    } else {
        var users = db.collection('details').find({email: req.body.email});
        users.count(function (err, count) {
            if (count > 0) {
                return res.send(409, { message: 'User is already registered'});
            }
            if(!req.body.name) {
                return res.send(400, { message: 'Missing name'})
            }

            if(!req.body.password) {
                return res.send(400, { message: 'Missing password'})
            }

            var name = req.body.name;
            var email =req.body.email;
            var pass = req.body.password;
            var phone =req.body.phone;

            var data = {
                "name": name,
                "email":email,
                "password":pass,
                "phone":phone
            };
            db.collection('details').insertOne(data,function(err, collection){
                if (err) throw err;
                console.log("Record inserted Successfully");

            });

            return res.send(200, { message: 'Thank you for subscribing.'});
        });
    }
});


app.get('/',function(req,res){
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('index.html');
}).listen(3000);


console.log("server listening at port 3000");