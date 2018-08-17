const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/CreationApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server');
    // deleteMany
    db.collection('Creations').deleteMany({text: 'Something to do'}).then((result) => {
        console.log(result);
    });
});