var Letter = function (id, character) {
    this.id = id;
    this.character = character;
    this.isUsed = false;
};

var Player = function(socket) {
    this.socket = socket;
    this.letters = [];
    this.ready = false;
    this.active = false;
};

var Game = function() {
    
    this.board = [];
    
    for (var i = 0; i < 8; i++) {
        var row = [];
        for (var j = 0; j < 8; j++) {
            row.push(null);
        }
        this.board.push(row);
    }
    
    var allLetters = [];
    
    var polishCharacters = {
        'A': 9, 
        'Ą': 1, 
        'B': 2, 
        'C': 3, 
        'Ć': 1, 
        'D': 3, 
        'E': 7, 
        'Ę': 1, 
        'F': 1, 
        'G': 2, 
        'H': 2, 
        'I': 8, 
        'J': 2, 
        'K': 3, 
        'L': 3, 
        'Ł': 2, 
        'M': 3, 
        'N': 5,
        'Ń': 1, 
        'O': 6, 
        'Ó': 1, 
        'P': 3, 
        'R': 4,
        'S': 4, 
        'Ś': 1,
        'T': 3, 
        'U': 2, 
        'W': 4, 
        'Y': 4, 
        'Z': 5, 
        'Ź': 1, 
        'Ż': 1
    };
    
    var counter = 0;
    for (var property in polishCharacters) {
        if (polishCharacters.hasOwnProperty(property)) {
            for (var k = 0; k < polishCharacters[property]; k++) {
                allLetters.push(new Letter(counter++, property));
            }
        }
    }
    
    this.players = [];
    
    this.addPlayer = function(socket) {
        this.players.push(new Player(socket));
    };
    
    this.sendLettersToPlayers = function() {
        this.players.forEach(function(player) {
            if (player.letters.length < 7) {
                var length = player.letters.length;
                player.letters = allLetters.splice(0, 7 - length);
            }
            player.socket.emit('letters', player.letters);
        });
    };
    
    this.setReady = function(socketId) {
        this.players.filter(function(player) { return player.socket.id === socketId; })[0].ready = true;
    };
    
    this.readyToGame = function() {
        return this.players.length === 2 && this.players.every(function(player) { return player.ready; });
    };
    
    this.setActive = function() {
        var currentlyActive = this.players.filter(function(player) { return player.active; });
        var notActive = this.players.filter(function(player) { return !player.active; });
        if (currentlyActive.length === 0) {
            this.players[0].active = true;
            this.players[0].socket.emit("yourMove");
        } else {
            currentlyActive[0].active = false;
            notActive[0].active = true;
            notActive[0].socket.emit("yourMove");
        }
    };
    
    this.opponent = function(socket) {
        return this.players.filter(function(element) { return element.socket.id !== socket.id; })[0];
    };
};

module.exports = function(server) {
    var self = this;
    var io = require("socket.io")(server);
    this.active = false;
    this.users = [];
    var rooms = [];
    var userRoom = {};
    var nicks = [];
    var roomGameMap = {};
    var clients = {};
    
    io.sockets.on("connection", function (socket) {
        self.users.push(socket);
        clients[socket.id] = socket;
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
            userRoom[socket.id] = room;
            echo("success", "");
            var game = roomGameMap[room];
            game.addPlayer(socket);
        });
        
        socket.on("createRoom", function(room) {
            socket.join(room);
            userRoom[socket.id] = room;
            rooms.push(room);
            var game = new Game();
            roomGameMap[room] = game;
            game.addPlayer(socket);
            
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
            socket.emit("playersInRoom", players);
        });
        
        socket.on("ready", function() {
            var room = userRoom[socket.id];
            var game = roomGameMap[room] || new Game(socket);
            game.setReady(socket.id);
            if (game.readyToGame()) {
                io.to(room).emit('gameStarted', game.board);
                game.sendLettersToPlayers();
                game.setActive();
            }
        });
        
        socket.on("move", function(move) {
            var room = userRoom[socket.id];
            var opponentSocket = roomGameMap[room].opponent(socket).socket;
            opponentSocket.emit('opponentMove', move);
            var game = roomGameMap[room];
            opponentSocket.on('accept', function() {
                socket.emit('accept');
                game.sendLettersToPlayers();
                roomGameMap[room].setActive();
            });
            
            
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