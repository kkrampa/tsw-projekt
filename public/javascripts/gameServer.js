var GameServer = function(socket) {
    var self = this;
    self.socket = socket;
    
    self.socket.on("connect", function() {
    });
    
    this.assignNick = function(nick, callback) {
        self.socket.emit("assignNick", nick);
        
        if (callback) {
            self.socket.on("echo", callback);
        }
    };
    
    this.getRooms = function(callback) {
        self.socket.emit("rooms");
        if (callback) {
            self.socket.on("rooms", callback);
        }
    };
    
    this.createNewRoom = function(name) {
        self.socket.emit("createRoom", name);
    };
    
    this.getPlayersInRoom = function(room, callback) {
        self.socket.emit("playersInRoom", room);
        if (callback) {
            self.socket.on("playersInRoom", callback);
        }
    };
    
    this.joinRoom = function(room, callback) {
        self.socket.emit("joinRoom", room);
        if (callback) {
            self.socket.on("echo", callback);
        }
    };
};

