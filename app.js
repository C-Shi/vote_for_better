require('dotenv').config();

var express = require('express'),
    bodyParser = require("body-parser"),
    mysql = require("mysql");

var app = express();
var connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    password : process.env.PASS,
    database : 'heroku_7f794d2e5391a58'
})
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    connection.query('SELECT COUNT(*) as count FROM people', (err, results) => {
        if (err) console.log(err);
        var count = results[0].count;
        res.render("index", {count:count});
    })
});

app.post('/vote', (req, res) => {
    var people = {
        email: req.body.email
    };
    
    connection.query('SELECT email FROM people WHERE email= ?', people.email, (err, results) => {
        if (err) throw err;
        if (results.length && results[0].email == people.email){
            res.render('fail');
        }else{
            connection.query('INSERT INTO people SET ?', people, (err, results) => {
                if (err) console.log(err);
                res.render('success');
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log('server start');
})