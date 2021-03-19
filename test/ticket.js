let chai = require('chai');
let chaiHttp = require('chai-http');
const { expect } = require("chai");
let should = chai.should();
chai.use(chaiHttp);

let testTicket = 
{ 
    allocatedTo: '', 
    info: 'Info test', 
    raisedBy: {
        "approved":false,
        "_id":"60548736b0942310f8e7a142",
        "title":"Mr",
        "first_name":"Approval",
        "last_name":"Test",
        "email":"test@unapproved.com",
        "department":{
            "_id":"603fae8b47dd1f2ff45bcda4",
            "name":"Computing",
            "created_at":"2021-03-03T15:43:07.060Z",
            "__v":0
        },
        "user_type":{
            "_id":"603fc34357977f90022bd6b2",
            "type":"client",
            "created_at":"2021-03-03T16:35:07.944Z"
        },
        "__v":0
    },
    title: 'Test Ticket 5' //Titles must be unqiue
};
let testTicketTwo = 
{ 
    allocatedTo: '', 
    info: 'Info test', 
    raisedBy: {
        "approved":false,
        "_id":"60548736b0942310f8e7a142",
        "title":"Mr",
        "first_name":"Approval",
        "last_name":"Test",
        "email":"test@unapproved.com",
        "department":{
            "_id":"603fae8b47dd1f2ff45bcda4",
            "name":"Computing",
            "created_at":"2021-03-03T15:43:07.060Z",
            "__v":0
        },
        "user_type":{
            "_id":"603fc34357977f90022bd6b2",
            "type":"client",
            "created_at":"2021-03-03T16:35:07.944Z"
        },
        "__v":0
    },
    title: 'Test Ticket 6' //Titles must be unqiue
};
let testTicketAdmin = 
{ 
    allocatedTo: '', 
    info: 'Info test', 
    raisedBy: {
        "approved":false,
        "_id":"60548736b0942310f8e7a142",
        "title":"Mr",
        "first_name":"Approval",
        "last_name":"Test",
        "email":"test@unapproved.com",
        "department":{
            "_id":"603fae8b47dd1f2ff45bcda4",
            "name":"Computing",
            "created_at":"2021-03-03T15:43:07.060Z",
            "__v":0
        },
        "user_type":{
            "_id":"603fc34357977f90022bd6b2",
            "type":"client",
            "created_at":"2021-03-03T16:35:07.944Z"
        },
        "__v":0
    },
    title: 'Test Ticket 2' //Titles must be unqiue
};

let string1 = Math.random().toString(36).substring(7);
let string2 = Math.random().toString(36).substring(7);
let string3 = Math.random().toString(36).substring(7);

function loginUser(done) {
    chai.request('http://localhost:8080').post('/api/login').set("Content-Type", "application/json")
    .send({ email: 'tom@gmail.com', password: 'password'})
    .end(function (err, res) {
        let token = res.body.Success.jwt
        done(token);
    });
}
function loginSupportUser(done) {
    chai.request('http://localhost:8080').post('/api/login').set("Content-Type", "application/json")
    .send({ email: 'tom@support.com', password: 'password'})
    .end(function (err, res) {
        let token = res.body.Success.jwt
        done(token);
    });
}
function loginClientUser(done) {
    chai.request('http://localhost:8080').post('/api/login').set("Content-Type", "application/json")
    .send({ email: 'tom@client.com', password: 'password'})
    .end(function (err, res) {
        let token = res.body.Success.jwt
        done(token);
    });
}

describe('Get Tickets', () => {
    it('User get ticket - it should return a array of tickets', (done) => {
        loginUser(function (authToken) {
            chai.request('http://localhost:8080').get('/ticket/get-tickets')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({ token: authToken })
            .set('Authorization', 'bearer ' + authToken)
            .end((err, res) => {
                res.body.should.be.a('array');
                res.should.have.status(200);
                done();
            });
        });
    });

    it('Unauthored User get tickets - it should return a 401 unauthorised', (done) => {
        chai.request('http://localhost:8080').get('/ticket/get-tickets')
        .set("Content-Type", "application/json")
        .set('Accept', 'application/json')
        .end((err, res) => {
            res.should.have.status(401);
            done();
        });
    });
});

describe('Create Tickets', () => {
    it('Unauthed User create ticket - it should return a 401', (done) => {
        chai.request('http://localhost:8080').post('/ticket/create-ticket')
        .set("Content-Type", "application/json")
        .set('Accept', 'application/json')
        .send({
            allocatedTo: testTicket.allocatedTo, 
            info: testTicket.info, 
            raisedBy: testTicket.raisedBy, 
            title: testTicket.title
        })
        .end((err, res) => {
            expect(res.text).to.equal('Unauthorized: No token provided');
            res.should.have.status(401);
            done();
        });
    });

    it('User admin create ticket - it should return a 401', (done) => {
        loginUser(function (authToken) {
            chai.request('http://localhost:8080').post('/ticket/create-ticket')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({
                token: authToken,
                allocatedTo: testTicket.allocatedTo, 
                info: testTicket.info, 
                raisedBy: testTicket.raisedBy, 
                title: string1
            })
            .set('Authorization', 'bearer ' + authToken)
            .end((err, res) => {
                expect(res.text).to.equal('Unauthorized: Invalid Permissions');
                res.should.have.status(401);
                done();
            });
        });
    });
    
    it('User support create ticket - it should return new ticket', (done) => {
        loginSupportUser(function (authToken) {
            chai.request('http://localhost:8080').post('/ticket/create-ticket')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({
                token: authToken,
                allocatedTo: testTicket.allocatedTo, 
                info: testTicket.info, 
                raisedBy: testTicket.raisedBy, 
                title: string2,
            })
            .set('Authorization', 'bearer ' + authToken)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
        });
    });

    it('User client create ticket - it should return new ticket', (done) => {
        loginClientUser(function (authToken) {
            chai.request('http://localhost:8080').post('/ticket/create-ticket')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({
                token: authToken,
                allocatedTo: testTicketTwo.allocatedTo, 
                info: testTicketTwo.info, 
                raisedBy: testTicketTwo.raisedBy, 
                title: string3,
            })
            .set('Authorization', 'bearer ' + authToken)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
        });
    });
});

describe('Edit Tickets', () => {
    it('Unauth User updates ticket - it should return a 401', (done) => {
        chai.request('http://localhost:8080').post('/ticket/update-ticket')
        .set("Content-Type", "application/json")
        .set('Accept', 'application/json')
        .send({
            ticket: {_id: '6054b575ec25aa1aa0b5f1d4' },
            allocatedTo: testTicket.allocatedTo, 
            info: 'Info edited', 
            raisedBy: testTicket.raisedBy, 
            title: 'Edited Ticket',
        })
        .end((err, res) => {
            expect(res.text).to.equal('Unauthorized: No token provided');
            res.should.have.status(401);
            done();
        });
    });

    it('User admin updates alternative to allocated to ticket - it should return Error', (done) => {
        loginUser(function (authToken) {
            chai.request('http://localhost:8080').post('/ticket/update-ticket')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({
                token: authToken,
                ticket: 
                    {
                        _id: '6054b575ec25aa1aa0b5f1d4', 
                        title: testTicket.title,
                        info: testTicket.info, 
                        status: 
                        {
                            _id:"6040d95750d39814e49a4476",
                            name:"Open",
                            created_at:"2021-03-04T12:57:59.566Z",
                            "__v":0
                        }
                    },
                status: 
                {
                    _id:"6040d96350d39814e49a4477",
                    name:"Suspended",
                    created_at:"2021-03-04T12:57:59.566Z",
                    "__v":0
                },
                allocatedTo: testTicket.allocatedTo, 
                info: 'Info edited', 
                raisedBy: testTicket.raisedBy, 
                title: 'Edited Ticket',
                currentUser: {isAdmin: true}
            })
            .set('Authorization', 'bearer ' + authToken)
            .end((err, res) => {
                expect(res.body.Error.status).to.equal('You dont have permissions to carry out this edit');
                res.should.have.status(200);
                done();
            });
        });
    });

    it('User admin updates allocated to ticket - it should return 200', (done) => {
        loginUser(function (authToken) {
            chai.request('http://localhost:8080').post('/ticket/update-ticket')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({
                token: authToken,
                ticket: 
                    {
                        _id: '6054b514913e091ebc0d5b7c',
                        title: testTicketAdmin.title,
                        info: testTicketAdmin.info, 
                        status: 
                        {
                            _id:"6040d95750d39814e49a4476",
                            name:"Open",
                            created_at:"2021-03-04T12:57:59.566Z",
                            "__v":0
                        }
                    },
                status: 
                {
                    _id:"6040d95750d39814e49a4476",
                    name:"Open",
                    created_at:"2021-03-04T12:57:59.566Z",
                    "__v":0
                },
                allocatedTo: {_id: null}, 
                info: testTicketAdmin.info, 
                raisedBy: testTicketAdmin.raisedBy,
                title: testTicketAdmin.title,
                currentUser: {isAdmin: true}
            })
            .set('Authorization', 'bearer ' + authToken)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
        });
    });

    it('User support updates ticket - it should return a 200', (done) => {
        loginSupportUser(function (authToken) {
            chai.request('http://localhost:8080').post('/ticket/update-ticket')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({
                token: authToken,
                ticket: 
                    {
                        _id: '6054b575ec25aa1aa0b5f1d4', 
                        title: testTicket.title,
                        info: testTicket.info, 
                        status: 
                        {
                            _id:"6040d95750d39814e49a4476",
                            name:"Open",
                            created_at:"2021-03-04T12:57:59.566Z",
                            "__v":0
                        }
                    },
                status: 
                {
                    _id:"6040d96350d39814e49a4477",
                    name:"Suspended",
                    created_at:"2021-03-04T12:57:59.566Z",
                    "__v":0
                },
                allocatedTo: testTicket.allocatedTo, 
                info: 'Info edited', 
                raisedBy: testTicket.raisedBy, 
                title: 'Edited Ticket',
                currentUser: {isAdmin: true}
            })
            .set('Authorization', 'bearer ' + authToken)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
        });
    });
    
    it('User client updates ticket - it should return a 200', (done) => {
        loginClientUser(function (authToken) {
            chai.request('http://localhost:8080').post('/ticket/update-ticket')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({
                token: authToken,
                ticket: 
                    {
                        _id: '6054b575ec25aa1aa0b5f1d4', 
                        title: testTicket.title,
                        info: testTicket.info, 
                        status: 
                        {
                            _id:"6040d95750d39814e49a4476",
                            name:"Open",
                            created_at:"2021-03-04T12:57:59.566Z",
                            "__v":0
                        }
                    },
                status: 
                {
                    _id:"6040d96350d39814e49a4477",
                    name:"Suspended",
                    created_at:"2021-03-04T12:57:59.566Z",
                    "__v":0
                },
                allocatedTo: testTicket.allocatedTo, 
                info: 'Info edited', 
                raisedBy: testTicket.raisedBy, 
                title: 'Edited Ticket',
                currentUser: {isAdmin: true}
            })
            .set('Authorization', 'bearer ' + authToken)
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
        });
    });
});