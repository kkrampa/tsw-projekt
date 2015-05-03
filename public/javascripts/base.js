(function () {
	"use strict";
	
	var Cell = function(color) {
		this.color = color || 'white';
	}
	
	var board = [
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
	]
	
	var canvas = document.getElementById('board');
	var context = canvas.getContext('2d');
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			context.strokeRect(10 + j * 40, 10 + i * 40, 40, 40);
			context.fillStyle = board[i][j].color;
			context.fillRect(10 + j * 40, 10 + i * 40, 40, 40);
		}
	}
	

}());