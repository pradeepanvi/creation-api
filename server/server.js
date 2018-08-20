var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Creation} = require('./models/creation');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/creations', (req, res) => {
    var creation = new Creation({
        text: req.body.text
    });

    creation.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.listen(3000, () => {
    console.log('Started on port 3000');
})

module.exports = {app};