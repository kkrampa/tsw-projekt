(function() {
    "use strict";
    var gameModule = angular.module('game', []);
    gameModule.controller('boardCtrl', function($scope) {
		var Cell = function(color) {
			this.color = color || 'white';
		};
		
		var Letter = function(character) {
			this.character = character;
		};
        
        var polishCharacters = [
            'A','Ą','B','C','Ć','D','E','Ę','F','G','H','I','J','K','L','Ł','M','N','Ń','O','Ó','P','R', 
            'S','Ś','T','U','W','Y','Z','Ź','Ż'
	    ]
	    var letters = [];
		
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