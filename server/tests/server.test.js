const expect = require('expect');
const reqeust = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Creation} = require('./../models/creation');

const creations = [{
    _id: new ObjectID(),
    text: 'First test creation'
}, {
    _id: new ObjectID(),
    text: 'Second test creation'
}]

beforeEach((done) => {
    Creation.remove({}).then(() => {
        return Creation.insertMany(creations);
    }).then(() => done());
})

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
 