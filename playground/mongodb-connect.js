const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/CreationApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB')
    }
    console.log('Connected to MongoDB');
    const db = client.db('CreationApp');

    // db.collection('Creations').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert creation', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    // Insert new doc into Users (name, age, location)
    // db.collection('Users').insertOne({
    //     name: 'Andrew',
    //     age: 25,
    //     location: 'Philade'
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to inser user', err);
    //     }
    //     console.log(result.ops);
    // })

    client.close();
})