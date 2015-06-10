var Word = require('./models/word');

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
    this.points = 0;
    
    this.getUsername = function() {
        return socket.request.user.username;
    };
};

var pointsMap = {
    'A': 1, 
    'Ą': 5, 
    'B': 3, 
    'C': 2, 
    'Ć': 6, 
    'D': 2, 
    'E': 1, 
    'Ę': 5, 
    'F': 5, 
    'G': 3, 
    'H': 3, 
    'I': 1, 
    'J': 3, 
    'K': 2, 
    'L': 2, 
    'Ł': 3, 
    'M': 2, 
    'N': 1,
    'Ń': 7, 
    'O': 1, 
    'Ó': 5, 
    'P': 2, 
    'R': 1,
    'S': 1, 
    'Ś': 5,
    'T': 2, 
    'U': 3, 
    'W': 1, 
    'Y': 2, 
    'Z': 1, 
    'Ź': 5, 
    'Ż': 9
};

var Game = function(io, room) {
    
    this.io = io;
    
    this.room = room;
    
    this.board = [];
    
    for (var i = 0; i < 15; i++) {
        var row = [];
        for (var j = 0; j < 15; j++) {
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
    
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
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
                player.letters = shuffle(allLetters).splice(0, 7 - length);
            }
            player.socket.emit('letters', player.letters);
        });
    };
    
     this.getScoreboard = function() {
        var scoreboard = [];
        this.players.forEach(function(player) {
            scoreboard.push({ username: player.getUsername(), points: player.points });
        });
        return scoreboard;
    };
    
    this.addPoints = function(socket, points) {
        var player = this.players.filter(function(player) { return player.socket.id === socket.id; })[0];
        this.players.filter(function(player) { return player.socket.id === socket.id; })[0].points += points;
        io.to(this.room).emit("points", this.getScoreboard());
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

module.exports = function(io) {
    var self = this;
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
        
        var broadcast = function(room, status, message) {
            io.to(room).emit("echo", {
                status: status,
                message: message
            });
        };
        
        socket.on("joinRoom", function(room) {
            var players = io.sockets.adapter.rooms[room];
            if (Object.keys(players).length <= 2) {
                socket.join(room);
                userRoom[socket.id] = room;
                echo("success", "");
                var game = roomGameMap[room];
                game.addPlayer(socket);
                broadcast(room, 'info', socket.request.user.username + " dołączył do gry!");
            } else {
                echo("failure", "");
            }
            
        });
        
        socket.on("createRoom", function(room) {
            socket.join(room);
            userRoom[socket.id] = room;
            rooms.push(room);
            var game = new Game(io, room);
            roomGameMap[room] = game;
            game.addPlayer(socket);
            broadcast(room, 'info', socket.request.user.username + " dołączył do gry!");
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
                io.to(room).emit('points', game.getScoreboard());
                broadcast(room, "info", "Gra rozpoczęta");
                game.sendLettersToPlayers();
                game.setActive();
            }
        });
        
        var checkAllEqual = function(arr) {
            for(var i = 1; i < arr.length; i++) {
                if(arr[i] !== arr[0]) {
                    return false;
                }
            }
            return true;
        };
        
        var buildWholeWord = function(board, x, y, constPart) {
            var wholeWord = [];
            
            if (constPart !== 1 && constPart !== 0) {
                return [];
            }
            
            while (board[x][y] !== null) {
                if (constPart === 1) {
                    x--;
                } else if (constPart === 0) {
                    y--;
                }
            }
            
            if (constPart === 1) {
                x++;
            } else {
                y++;
            }

            while (board[x][y] !== null) {
                wholeWord.push(board[x][y]);
                if (constPart === 1) {
                    x++;
                } else if (constPart === 0) {
                    y++;
                } 
            }
            return wholeWord;
        };
        
        var allCombinations = function(board, actualMove) {
            var xs = actualMove.map(function(element) { return element.x; });
            var ys = actualMove.map(function(element) { return element.y; });
            var allWords = [];
            var wholeWordX = [];
            var wholeWordY = [];
            

            if (checkAllEqual(xs)) {
                wholeWordX = buildWholeWord(board, xs[0], ys.sort(function(a, b){return a-b;})[0], 0);
                ys.forEach(function(y) {
                    var word = buildWholeWord(board, xs[0], y, 1);
                    if (word.length > 1) allWords.push(word);
                });
            }
            
            if (checkAllEqual(ys)) {
                wholeWordY = buildWholeWord(board, xs.sort(function(a, b){return a-b;})[0], ys[0], 1);
                xs.forEach(function(x) {
                    var word = buildWholeWord(board, x, ys[0], 0);
                    if (word.length > 1) allWords.push(word);
                });
            }
            
            if (xs.length === 1) {
                return [wholeWordX, wholeWordY].filter(function(element) { return element.length > 1; });
            }

            
            if (wholeWordX.length > 1) allWords.push(wholeWordX);
            if (wholeWordY.length > 1) allWords.push(wholeWordY);
            return allWords;
        };
        
        var moveIsLegal = function(board, actualMove) {
            if (actualMove.length < 1) {
                return false;
            }
            
            var xs = actualMove.map(function(element) { return element.x; });
            var ys = actualMove.map(function(element) { return element.y; });
            
            var wholeWordX = [];
            var wholeWordY = [];
            var temp = [];
            var allWords = [];
            
            if (checkAllEqual(xs)) {
                temp = ys.sort(function(a, b){return a-b;});
                if (temp.length !== 0 && xs.length !== 0) {
                    wholeWordX = buildWholeWord(board, xs[0], temp[0], 0);
                    ys.forEach(function(y) {
                        allWords.push(buildWholeWord(xs[0], y, 1));
                    });
                }
            }
            
            if (checkAllEqual(ys)) {
                temp = xs.sort(function(a, b){return a-b;});
                if (temp.length !== 0 && ys.length !== 0) {
                    wholeWordY = buildWholeWord(board, temp[0], ys[0], 1);
                    xs.forEach(function(x) {
                        allWords.push(buildWholeWord(board, x, ys[0], 0));
                    });
                }
            }
            if (temp.length === 0) {
                return false;
            }
            
            if (wholeWordX.length === 1 && wholeWordY.length === 1) {
                return false;
            }
            
            var wordToCheck;
            if (wholeWordX.length > 0) {
                wordToCheck = wholeWordX.map(function(element) { return element.y; }).sort(function(a, b){return a-b;});
            } else {
                wordToCheck = wholeWordY.map(function(element) { return element.x; }).sort(function(a, b){return a-b;});
            }
                        
            for (var m = 1; m < wordToCheck.length; m++) {
                if (Math.abs(wordToCheck[m] - wordToCheck[m - 1]) !== 1) {
                    return false;
                }
            }
            return true;
        };
        
        var removeDirties = function(board) {
            for (var i = 0; i < board.length; i++) {
                var row = board[i];
                for (var j = 0; j < row.length; j++) {
                    if (row[j] && row[j].isDirty) {
                        row[j] = null;
                    }
                }
            }
        };
        
        var markAsClean = function(board) {
            for (var i = 0; i < board.length; i++) {
                var row = board[i];
                for (var j = 0; j < row.length; j++) {
                    if (row[j] && row[j].isDirty) {
                        row[j].isDirty = false;
                    }
                }
            }
        };
        
        var assignPoints = function(socket, game, move) {
            var points = 0;
            allCombinations(game.board, move).forEach(function(element) {
                element.forEach(function(letter) {
                    points += pointsMap[letter.character];
                });
            });
            game.addPoints(socket, points);  
        };
        
        socket.on("move", function(move) {
            var room = userRoom[socket.id];
            var opponentSocket = roomGameMap[room].opponent(socket).socket;
            var game = roomGameMap[room];
            move.forEach(function(element) {
                element.isDirty = true;
                game.board[element.x][element.y] = element;
            });
            if (!moveIsLegal(game.board, move)) {
                socket.emit('invalid');
                removeDirties(game.board);
            } else {
                socket.emit('valid');
                broadcast(room, "info", socket.request.user.username + " zakończył swój ruch. Akceptuj lub sprawdź");
                opponentSocket.emit('opponentMove', move);
                opponentSocket.once('accept', function() {
                    io.to(room).emit('accept');
                    assignPoints(socket, game, move);
                    game.sendLettersToPlayers();
                    roomGameMap[room].setActive();
                    markAsClean(game.board);
                    opponentSocket.removeAllListeners('check');
                });
                
                opponentSocket.once('check', function() {
                    var words = allCombinations(game.board, move).map(function(element) {
                        return element.map(function(e) { return e.character; }).join('').toLocaleLowerCase();
                    });
                    broadcast(room, "info", opponentSocket.request.user.username + " sprawdza w słowniku.");

                    Word.find().where('name').in(words).exec(function(err, arr) {
                        console.log(arr);
                        console.log(words);
                        if (arr.length !== words.length) {
                            removeDirties(game.board);
                            io.to(room).emit('notValidWord');
                            roomGameMap[room].setActive();
                            broadcast(room, "info", "Jednego ze słów nie ma w słowniku!");

                        } else {
                            markAsClean(game.board);
                            io.to(room).emit('accept');
                            assignPoints(socket, game, move);
                            socket.emit('yourMove');
                            broadcast(room, "info", "Słowo znajduje się w słowniku. Utrata kolejki!");
                        }
                        game.sendLettersToPlayers();
                    });
                    opponentSocket.removeAllListeners('accept');
                });
            }
            
            
            
            
            
        });
        
        socket.on("disconnect", function(data) {
            console.log("Disconnecting");
            socket.leave(userRoom[socket.id]);
            clients[socket.id] = undefined;
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