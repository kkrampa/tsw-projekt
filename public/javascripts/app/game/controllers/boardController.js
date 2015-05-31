(function () {
    "use strict";
    var gameModule = angular.module('game', ['ngDragDrop']);
    gameModule.controller('boardCtrl', function ($scope) {        
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
        
        $scope.draggedItem = null;
        
        $scope.isDroppable = function($index, $parent) {
            return $scope.board[$parent][$index].letter === null;
        };
        
        $scope.isDroppableBack = function() {
            if (!$scope.draggedItem) {
                return false;
            }
            return $scope.draggedItem.isUsed;
        };

        var Letter = function (character) {
            this.character = character;
            this.isUsed = false;
        };

        var polishCharacters = [
            'A', 'Ą', 'B', 'C', 'Ć', 'D', 'E', 'Ę', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Ł', 'M', 'N', 'Ń', 'O', 'Ó', 'P', 'R',
            'S', 'Ś', 'T', 'U', 'W', 'Y', 'Z', 'Ź', 'Ż'
        ];

        $scope.letters = polishCharacters.map(function (el) {
            return new Letter(el);
        });
        
        $scope.draggedCell = null;
        
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
            //ui.draggable.remove();
            $scope.board[$parent][$index].letter = $scope.draggedItem;
            $scope.draggedItem = null;
        };
        
        $scope.onDropBack = function(event, ui, $index) {
            $scope.draggedItem.isUsed = false;
            $scope.draggedItem = null;
            $scope.draggedCell.letter = null;
            $scope.draggedCell = null;
        };

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
    });
}());