module.exports = function(server) {
    var self = this;
    var io = require("socket.io")(server);
    this.active = false;
    this.users = [];
    var rooms = [];
    var userRoom = {};
    
    io.sockets.on("connection", function (socket) {
        self.users.push(socket);
        if (self.users.length === 2) {
            self.active = true;
        }
        
        socket.on("createRoom", function(room) {
            socket.join(room);
            userRoom[socket.id] = room;
            rooms.push(room);
        });
    
        socket.on("rooms", function() {
            socket.emit('rooms', rooms);
        });
        
        socket.on("disconnect", function(data) {
            socket.leave(userRoom[socket.id]);
            for (var i = 0; i < self.users.length; i++) {
                if (self.users[i].id === socket.id) {
                    self.users.splice(i, 1);
                    break;
                }
            }
        });
    });
};