(function() {
    "use strict";
    var gameModule = angular.module('game', ['ngDragDrop']);
    gameModule.controller('boardCtrl', function($scope) {
		var Cell = function(color) {
			this.color = color || 'white';
            this.letter = null;
		};
		
		var Letter = function(character) {
			this.character = character;
		};
        
        var polishCharacters = [
            'A','Ą','B','C','Ć','D','E','Ę','F','G','H','I','J','K','L','Ł','M','N','Ń','O','Ó','P','R', 
            'S','Ś','T','U','W','Y','Z','Ź','Ż'
	    ]
        
        $scope.letters = polishCharacters.map(function(el) {
            return new Letter(el);
        });
        
        $scope.onDrop = function(event, ui, letter, $index, $parent) {
            var letter = ui.draggable.text();
            ui.draggable.remove();
            $scope.board[$parent][$index].letter = letter;
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
				new Cell(), new Cell(), new Cell('pink'), new Cell(), new Cell(), 
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