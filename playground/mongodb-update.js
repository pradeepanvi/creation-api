const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/CreationApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server');
    //Update data
    db.collection('Creations').findOneAndUpdate({
        _id: new ObjectID('5b76bed2eb3b4f16a4c10306')
    }, {
        $set: {
            text: 'Pradeep do something'
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })
})