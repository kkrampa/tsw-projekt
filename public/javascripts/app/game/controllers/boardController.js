(function () {
    "use strict";
    var gameModule = angular.module('game');
    gameModule.controller('boardCtrl', function ($scope, $state, socket) {
        
        var gameServer = new GameServer(socket);
        
        //helpers
        var Cell = function (cellColor) {
            var self = this;
            var color = cellColor || 'white';
            this.letter = null;
            this.getColor = function () {
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
                        
        $scope.draggedItem = null;
        
        $scope.actualMove = [];

        var polishCharacters = [
            'A', 'Ą', 'B', 'C', 'Ć', 'D', 'E', 'Ę', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Ł', 'M', 'N', 'Ń', 'O', 'Ó', 'P', 'R',
            'S', 'Ś', 'T', 'U', 'W', 'Y', 'Z', 'Ź', 'Ż'
        ];

        $scope.letters = polishCharacters.map(function (el) {
            return new Letter(el);
        });
        
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
            $scope.actualMove = [];  
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
            $scope.board[$parent][$index].letter = $scope.draggedItem;
            $scope.actualMove.push($scope.draggedItem);
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
    });
}());