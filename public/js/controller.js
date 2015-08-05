var moviesApp = angular.module('moviesApp', ['ngAnimate','ngRoute']);

moviesApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/:movieId', {
			templateUrl: 'partials/detailed.html',
			controller: 'moviesCtrl'
		}).otherwise({
			
			templateUrl: 'partials/list.html',
			controller: 'moviesCtrl'
	});
		
}]);





moviesApp.controller('moviesCtrl', function ($scope, $animate, $http, $routeParams) {
    $http.get('../data/movies.json').success(function(data) {
        $scope.movies = data;
       	$scope.singleMovie= $scope.movies[($routeParams.movieId)-1]

      });


  

});

