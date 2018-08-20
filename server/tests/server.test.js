const expect = require('expect');
const reqeust = require('supertest');

const {app} = require('./../server');
const {Creation} = require('./../models/creation');

beforeEach((done) => {
    Creation.remove({}).then(() => done());
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