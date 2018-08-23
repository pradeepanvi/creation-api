require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Creation} = require('./models/creation');
var {User} = require('./models/user');

const port = process.env.PORT || 3000;

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

app.get('/creations', (req, res) => {
    Creation.find().then((creations) => {
        res.send({creations});
    }, (e) => {
        res.status(400).send(e);
    })
})

//GET /creations/123456
app.get('/creations/:id', (req, res) => {
    var id = req.params.id;
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Creation.findById(id).then((creation) => {
        if(!creation) {
            return res.status(404).send();
        }

        res.send({creation});
    }).catch((e) => {
        res.status(400).send();
    })
})

//Delete
app.delete('/creations/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Creation.findByIdAndRemove(id).then((creation) => {
        if(!creation){
            return res.status(404).send();
        }
        res.send(creation);
    }).catch((e) => {
        res.status(404).send();
    })
})

//Update Data
app.patch('/creations/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Creation.findByIdAndUpdate(id, {$set: body}, {new: true}).then((creation) => {
        if(!creation) {
            return res.status(404).send();
        }

        res.send({creation});
    }).catch((e) => {
        res.status(400).send();
    })
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
})

module.exports = {app};