const expect = require('expect');
const reqeust = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Creation} = require('./../models/creation');
const {User} = require('./../models/user');
const {creations, populateCreations, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateCreations);

describe('POST /creations', () => {
    it('should create a new creation', (done) => {
        var text = 'Text creation text';
        reqeust(app)
            .post('/creations')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Creation.find().then((creations) => {
                    expect(creations.length).toBe(1);
                    expect(creations[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));

            })
    });

    it('should not create creation with invalid body data', (done) => {
        reqeust(app)
            .post('/creations')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Creation.find().then((creations) => {
                    expect(creations.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    })
})

describe('GET /creations', () => {
    it('should get all creations', (done) => {
        request(app)
            .get('/creations')
            .expect(200)
            .expect((res) => {
                expect(res.body.creations.length).toBe(0);
            })
            .end(done);
    })
})

describe('GET /creations/:id', () => {
    it('should return creation doc', (done) => {
        request(app)
            .get(`/creations/${creations[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.creation.text).toBe(creations[0].text);
            })
            .end(done);
    });

    it('should return 404 if creation not found', (done) => {
        var hexId = new ObjectID().toHexString();
        reqeust(app)
            .get(`/creations/${hexId}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/creations/123abc')
            .expect(404)
            .end(done)
    })
 })
 
 describe('DELETE /creations/:id', () => {
     it('should remove a creation', (done) => {
         var hexId = creation[1]._id.toHexString();

         request(app)
            .delete(`/creations/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.creation._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Creation.findById(hexId).then((creation) => {
                    expect(creation).toNotExist();
                    done();
                }).catch((e) => done(e));
            })
     })
 })

 describe('PATCH /creations/:id', () => {
    it('should update the creation', (done) => {
        var hexId = creations[0]._id.toHexString();
        var text = 'This should be the new text';
 
        request(app)
            .patch(`/creations/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.creation.text).toBe(text);
                expect(res.body.creation.completed).toBe(true);
                expect(res.body.creation.completedAt).toBeA('number');
            })
            .end(done)
    })
 
    it('should clear completedAt when creation is not completed', (done) => {
        var hexId = creations[1]._id.toHexString();
        var text = 'This should be the new text!!';
 
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.creation.text).toBe(text);
                expect(res.body.creation.completed).toBe(false);
                expect(res.body.creation.completedAt).toNotExist();
            })
            .end(done)
    })
 })
 
 describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    })
 
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done);
    })
 })
 
 describe('POST /users/', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123mnb!';
 
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }
 
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                })
            });
    });
    it('should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'and',
                password: '123'
            })
            .expect(400)
            .end(done)
    });
 
    it('should not create user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'Password123!'
            })
            .expect(400)
            .end(done)
    });
 
})

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
 
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            })
    })
 
    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + '1'
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
 
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    });
 
})

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
 
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    })
 })
 