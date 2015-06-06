var assert = require('chai').assert;
var io = require('socket.io-client');
var http = require('http');

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
    it('should connect one user to socket', function() {
        client = io.connect(socketURL, options);
        client.on('connect', function(){
            assert.equal(server.users.length, 1);
        });

    });
    
    it('should return that game is not active', function() {
        assert.isFalse(server.active);
    });
    
    it('should return that game is active', function() {
        client2 = io.connect(socketURL, options);
        client2.on('connect', function() {
            assert.isTrue(server.active);
        });
    });
});
