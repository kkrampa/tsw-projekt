module.exports = function(server) {
    var self = this;
    var io = require("socket.io")(server);
    this.active = false;
    this.users = [];
    io.sockets.on("connection", function (socket) {
        self.users.push(socket);
        if (self.users === 2) {
            self.active = true;
        }
    });
};