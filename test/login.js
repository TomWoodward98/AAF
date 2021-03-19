let chai = require('chai');
let chaiHttp = require('chai-http');
const { expect } = require("chai");

chai.use(chaiHttp);

//the parent block
describe('Login', () => {
    it(`User doesn't exist`, (done) => {
        chai.request('http://localhost:8080').post('/api/login').set("Content-Type", "application/json")
        .send({ email: 'tom@tom.com', password: 'pass123' })
        .end((err, res) => {
            expect(res.body.Error.email).to.equal('This user does not exist')
            done();
        });
    });

    it(`Incorrect username or password`, (done) => {
        chai.request('http://localhost:8080').post('/api/login').set("Content-Type", "application/json")
        .send({ email: 'tom@gmail.com', password: 'pass123' })
        .end((err, res) => {
            expect(res.body.Error.email).to.equal('Incorrect email or password')
            expect(res.body.Error.password).to.equal('Incorrect email or password')
            done();
        });
    });

    it(`Unapproved account`, (done) => {
        chai.request('http://localhost:8080').post('/api/login').set("Content-Type", "application/json")
        .send({ email: 'test@unapproved.com', password: 'password' })
        .end((err, res) => {
            expect(res.body.Error.approved).to.equal('Your account has not been approved yet, please contact a site admin')
            done();
        });
    });
    

    it(`Successfull login`, (done) => {
        chai.request('http://localhost:8080').post('/api/login').set("Content-Type", "application/json")
        .send({ email: 'tom@gmail.com', password: 'password' })
        .end((err, res) => {
            expect(res.body.Success.user)
            done();
        });
    });

    it(`Logout`, (done) => {
        chai.request('http://localhost:8080').post('/api/logout').set("Content-Type", "application/json")
        .end((err, res) => {
            expect(res.body)
            done();
        });
    });
});