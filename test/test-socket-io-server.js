/*jshint node: true */

var io = require('socket.io-client');
var http = require('http');
var should = require('should');

var socketURL = 'http://localhost:3000';

var options = {
  transports: ['websocket'],
  'force new connection': true,
  reconnect: true
};

describe("Game server", function() {
    var Server = require('../server');
    var httpServer = http.createServer().listen(3000);
    var server = new Server(httpServer);

    var client = null;
    var client2 = null;
    it('should connect one user to socket', function(done) {
        client = io.connect(socketURL, options);
        client.on('connect', function(){
            server.users.length.should.equal(1);
            client.disconnect();
            done();
        });
    });
    
    it('should return that game is not active', function(done) {
        client = io.connect(socketURL, options);
        client.on('connect', function() {
            server.active.should.be.false;
            done();
        });
    });
    
    it('should return that game is active', function(done) {
        client = io.connect(socketURL, options);
        client.on('connect', function() {
            client2 = io.connect(socketURL, options);
            client2.on('connect', function() {
                server.active.should.be.true;
                client.disconnect();
                client2.disconnect();
                done();
            });
        });
    });
    
    it('should return no rooms', function(done) {
        client2 = io.connect(socketURL, options);
        client2.on('connect', function() {
            client2.on('rooms', function(rooms) {
                rooms.length.should.equal(0);
                done();
            });
        
            client2.emit('rooms');
        });
    });
    
    it('should create room', function(done) {
        client = io.connect(socketURL, options);
        client.on('connect', function() {
            client.emit("createRoom", "test");
            client.emit("rooms");
            client.on('rooms', function(rooms) {
                rooms.length.should.equal(1);
                var room = rooms[0];
                room.should.equal("test");
                done();
            });
        });
    });
    
    
});
