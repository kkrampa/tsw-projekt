(function () {
    "use strict";
    var gameModule = angular.module('game');
    gameModule.controller('boardCtrl', function ($scope, $state, socket) {
        
        var dirtyFields = [];
        socket.on("letters", function(letters) {
            $scope.letters = letters;
        });
        
        socket.on("echo", function(message) {
            $scope.echoes.push(message);
        });
    
        socket.on("gameStarted", function(board) {
        });
        
        socket.on("yourMove", function() {
            $scope.inMove = true;
        });
        
        socket.on("opponentMove", function(move) {
            move.forEach(function(element) {
                var cell = $scope.board[element.x][element.y];
                cell.letter = element;
                cell.isDirty = true;
                dirtyFields.push(cell);
            });
            $scope.evaluateMove = true;
        });
        
        socket.on("accept", function() {
            $scope.actualMove = [];
            dirtyFields.forEach(function(element) {
                element.isDirty = false;
            });
            dirtyFields = [];
        });
        
        socket.on("invalid", function() {
            $scope.messages = ["Twój ruch nie jest prawidłowy"];
        });
        
        socket.on("valid", function() {
            $scope.inMove = false;
            $scope.messages = [];
        });
        
        var removeDirties = function() {
            for (var i = 0; i < $scope.board.length; i++) {
                var row = $scope.board[i];
                for (var j = 0; j < row.length; j++) {
                    if (row[j] && (row[j].isDirty)) {
                        row[j].letter = null;
                        row[j].isDirty = false;
                    }
                }
            }
            
            $scope.actualMove.forEach(function(element) {
                $scope.board[element.x][element.y].letter = null;
                element.isUsed = false;
                element.x = null;
                element.y = null;
                $scope.letters.push(element);
            });
            
            $scope.actualMove = [];
        };
        
        socket.on("notValidWord", function() {
            removeDirties();
        });
        
        socket.on("points", function(points) {
            $scope.points = points;
        });
        
        var gameServer = new GameServer(socket);
        
        //helpers
        var Cell = function (cellColor) {
            var self = this;
            var color = cellColor || 'white';
            this.letter = null;
            this.isDirty = false;
            this.x = null;
            this.y = null;
            this.getColor = function () {
                if (self.isDirty) {
                    return "yellow";
                }
                if (self.letter) {
                    return 'antiquewhite';
                }
                return color;
            };
        };
        
        var Letter = function (character) {
            this.character = character;
            this.isUsed = false;
        };
        
        //scope fields
        
        $scope.echoes = [];
        
        $scope.points = {};
        
        $scope.messages = [];
                
        $scope.evaluateMove = false;
        
        $scope.inMove = false;
        
        $scope.isReady = false;
                        
        $scope.draggedItem = null;
        
        $scope.actualMove = [];

        var polishCharacters = [
            'A', 'Ą', 'B', 'C', 'Ć', 'D', 'E', 'Ę', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Ł', 'M', 'N', 'Ń', 'O', 'Ó', 'P', 'R',
            'S', 'Ś', 'T', 'U', 'W', 'Y', 'Z', 'Ź', 'Ż'
        ];

        $scope.letters = [];
        
        $scope.draggedCell = null;
        
        $scope.board = [
           [
            new Cell('red'), new Cell(), new Cell(), new Cell('lightblue'), new Cell(),
            new Cell(), new Cell(), new Cell('red'), new Cell(), new Cell(),
            new Cell(), new Cell('lightblue'), new Cell(), new Cell(), new Cell('red')
           ],
           [
            new Cell(), new Cell('pink'), new Cell(), new Cell(), new Cell(),
            new Cell('blue'), new Cell(), new Cell(), new Cell(), new Cell('blue'),
            new Cell(), new Cell(), new Cell(), new Cell('pink'), new Cell()
           ],
           [
            new Cell(), new Cell(), new Cell('pink'), new Cell(), new Cell(),
            new Cell(), new Cell('lightblue'), new Cell(), new Cell('lightblue'), new Cell(),
            new Cell(), new Cell(), new Cell('pink'), new Cell(), new Cell()
           ],
           [
            new Cell('lightblue'), new Cell(), new Cell(), new Cell('pink'), new Cell(),
            new Cell(), new Cell(), new Cell('lightblue'), new Cell(), new Cell(),
            new Cell(), new Cell('pink'), new Cell(), new Cell(), new Cell('lightblue')
           ],
           [
            new Cell(), new Cell(), new Cell(), new Cell(), new Cell('pink'),
            new Cell(), new Cell(), new Cell(), new Cell(), new Cell(),
            new Cell('pink'), new Cell(), new Cell(), new Cell(), new Cell()
           ],
           [
            new Cell(), new Cell('blue'), new Cell(), new Cell(), new Cell(),
            new Cell('blue'), new Cell(), new Cell(), new Cell(), new Cell('blue'),
            new Cell(), new Cell(), new Cell(), new Cell('blue'), new Cell()
           ],
           [
            new Cell(), new Cell(), new Cell('lightblue'), new Cell(), new Cell(),
            new Cell(), new Cell('lightblue'), new Cell(), new Cell('lightblue'), new Cell(),
            new Cell(), new Cell(), new Cell('lightblue'), new Cell(), new Cell()
           ],
           [
            new Cell('red'), new Cell(), new Cell(), new Cell('lightblue'), new Cell(),
            new Cell(), new Cell(), new Cell('pink', true), new Cell(), new Cell(),
            new Cell(), new Cell('lightblue'), new Cell(), new Cell(), new Cell('red')
           ],
           [
            new Cell(), new Cell(), new Cell('lightblue'), new Cell(), new Cell(),
            new Cell(), new Cell('lightblue'), new Cell(), new Cell('lightblue'), new Cell(),
            new Cell(), new Cell(), new Cell('lightblue'), new Cell(), new Cell()
           ],
           [
            new Cell(), new Cell('blue'), new Cell(), new Cell(), new Cell(),
            new Cell('blue'), new Cell(), new Cell(), new Cell(), new Cell('blue'),
            new Cell(), new Cell(), new Cell(), new Cell('blue'), new Cell()
           ],
           [
            new Cell(), new Cell(), new Cell(), new Cell(), new Cell('pink'),
            new Cell(), new Cell(), new Cell(), new Cell(), new Cell(),
            new Cell('pink'), new Cell(), new Cell(), new Cell(), new Cell()
           ],
           [
            new Cell('lightblue'), new Cell(), new Cell(), new Cell('pink'), new Cell(),
            new Cell(), new Cell(), new Cell('lightblue'), new Cell(), new Cell(),
            new Cell(), new Cell('pink'), new Cell(), new Cell(), new Cell('lightblue')
           ],
           [
            new Cell(), new Cell(), new Cell('pink'), new Cell(), new Cell(),
            new Cell(), new Cell('lightblue'), new Cell(), new Cell('lightblue'), new Cell(),
            new Cell(), new Cell(), new Cell('pink'), new Cell(), new Cell()
           ],
           [
            new Cell(), new Cell('pink'), new Cell(), new Cell(), new Cell(),
            new Cell('blue'), new Cell(), new Cell(), new Cell(), new Cell('blue'),
            new Cell(), new Cell(), new Cell(), new Cell('pink'), new Cell()
           ],
           [
            new Cell('red'), new Cell(), new Cell(), new Cell('lightblue'), new Cell(),
            new Cell(), new Cell(), new Cell('red'), new Cell(), new Cell(),
            new Cell(), new Cell('lightblue'), new Cell(), new Cell(), new Cell('red')
           ],
        ];
        
        //methods
        $scope.isDroppable = function($index, $parent) {
            return $scope.board[$parent][$index].letter === null;
        };
        
        $scope.isDroppableBack = function() {
            if (!$scope.draggedItem) {
                return false;
            }
            return $scope.draggedItem.isUsed;
        };
        
        $scope.endMove = function() {
            socket.emit('move', $scope.actualMove);
        };
        
        $scope.isInActualMove = function($item) {
            return $scope.actualMove.some(function(element) { return $item === element; });
        };
        
        //event handlers
        $scope.onDragStart = function(ui, event, $item, index) {
            $scope.draggedItem = $item;
        };
        
        $scope.onDragFromBoard = function(ui, event, $item, cell) {
            $scope.draggedItem = $item;
            $scope.draggedCell = cell;
        };

        $scope.onDrop = function (event, ui, letter, $index, $parent) {
            var existingArray = $scope.board.map(function(row) {
                return row.filter(function(cell) { return cell.letter === $scope.draggedItem;});
            }).filter(function(element) { return element.length > 0;});
            if (existingArray.length > 0) {
                var existing = existingArray[0];
                existing[0].letter = null;
            }
            
            $scope.draggedItem.isUsed = true;
            $scope.draggedItem.x = $parent;
            $scope.draggedItem.y = $index;
            $scope.board[$parent][$index].letter = $scope.draggedItem;
            if ($scope.actualMove.filter(function(element) { return element === $scope.draggedItem;}).length === 0) {
                $scope.actualMove.push($scope.draggedItem);
            }
            $scope.draggedItem = null;
        };
        
        $scope.onDropBack = function(event, ui, $index) {
            for (var i = 0; i < $scope.actualMove; i++) {
                if ($scope.actualMove[i] === $scope.draggedItem) {
                    $scope.actualMove.splice(i, 1);
                    break;
                }
            }
            $scope.draggedItem.isUsed = false;
            $scope.draggedItem = null;            
            $scope.draggedCell.letter = null;
            $scope.draggedCell = null;
        };
        
        $scope.ready = function() {
            socket.emit("ready");
            $scope.isReady = true;
        };
        
        $scope.accept = function() {
            socket.emit("accept");
            $scope.evaluateMove = false;
            
        };
        
        $scope.check = function() {
            socket.emit("check");
            $scope.evaluateMove = false;
        };
    });
}());