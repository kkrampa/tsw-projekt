module.exports = function(server) {
    var self = this;
    var io = require("socket.io")(server);
    this.active = false;
    this.users = [];
    var rooms = [];
    var userRoom = {};
    var nicks = [];
    
    io.sockets.on("connection", function (socket) {
        self.users.push(socket);
        if (self.users.length === 2) {
            self.active = true;
        }
        
        var echo = function(status, message) {
            socket.emit("echo", {
                status: status,
                message: message
            });
        };
        
        socket.on("joinRoom", function(room) {
            socket.join(room);
            echo("success", "");
        });
        
        socket.on("createRoom", function(room) {
            socket.join(room);
            userRoom[socket.id] = room;
            rooms.push(room);
        });
        
        socket.on("assignNick", function(nick) {
            var isUsed = nicks.some(function(element) {
                return element === nick;
            });
            if (!isUsed) {
                socket.nick = nick;
                nicks.push(nick);
                echo("success", "Twój nick to: " + nick);
            } else {
                echo("failure", "Ten nick jest zajęty!");
            }
        });
    
        socket.on("rooms", function() {
            socket.emit('rooms', rooms);
        });
        
        socket.on("playersInRoom", function(room) {
            var players = io.sockets.adapter.rooms[room];
            console.log(players);
            socket.emit("playersInRoom", players);
        });
        
        socket.on("disconnect", function(data) {
            socket.leave(userRoom[socket.id]);
            for (var i = 0; i < self.users.length; i++) {
                if (self.users[i].id === socket.id) {
                    self.users.splice(i, 1);
                    break;
                }
            }
            
            for (var j = 0; j < nicks.length; j++) {
                if (nicks[j] === socket.nick) {
                    nicks.splice(j, 1);
                    break;
                }
            }
        });
    });
};