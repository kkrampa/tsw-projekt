angular.module('game', [
  'ui.router', 'ngDragDrop', 'btford.socket-io'
    
]).factory('socket', function (socketFactory) {
  return socketFactory();
}).config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/rooms');
        
        $stateProvider.state('rooms', {
            url: "/rooms",
            templateUrl: "javascripts/app/partials/rooms.html",
            controller: function($scope, $state, socket) {
                var gameServer = new GameServer(socket);
                $scope.rooms = [];
                socket.on('rooms', function(rooms) {
                    $scope.rooms = rooms;
                });
                
                gameServer.getRooms();
                
                $scope.name = "";
                
                $scope.create = function() {
                    gameServer.createNewRoom($scope.name);
                    $state.go('game', { roomName: $scope.name });
                };
                
                $scope.join = function(room) {
                    gameServer.joinRoom(room, function(data) {
                        if (data.status === 'success') {
                            $state.go('game', { roomName: room });
                        }
                    });
                };
            }
        });
        
        $stateProvider.state('game', {
            url: "/game/:roomName",
            templateUrl: "javascripts/app/partials/game.html",
            controller: 'boardCtrl'
        });
    }]
);