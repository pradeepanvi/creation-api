const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Creation} = require('./../../models/creation');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
   _id: userOneId,
   email: 'stac.pradeep@gmail.com',
   password: 'userOnePass',
   tokens: [{
       access: 'auth',
       token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
   }]
}, {
   _id: userTwoId,
   email: 'jen@example.com',
   password: 'userTwoPass'
}]

const creations = [{
   _id: new ObjectID(),
   text: 'First test todo'
}, {
    _id: new ObjectID(),
   text: 'Second test todo',
   completed: true,
   completedAt: 333
}];

const populateCreations = (done) => {
    Creation.remove({}).then(() => {
       return Creation.insertMany(creations);
   }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
}

module.exports = {creations, populateCreations, users, populateUsers};