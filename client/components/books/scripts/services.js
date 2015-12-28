'use strict'

var booksServices = angular.module('booksServices', []);

booksServices.factory('Books', function ($http, $q, $state, $location){
	
	var books;

	return {
		list: function(){
			var deferred = $q.defer();
			// This is mocking a db request by getting the info from a json static file on client side
			$http({ method: 'GET', url: '/data/books.json' })
				.then(function successCallback(response) { 
					books = response.data;
					deferred.resolve(books);                     
			  	}, function errorCallback(response) {
			  		deferred.reject("Ups, looks like we are having some troubles right now, please try in a few minutes."); // Lets supose a 500 internal server error
				});
			return deferred.promise;	
		},
		open: function(bookName){		

			// This function mocks the db task of finding a specific element of a collection
			function auxiliaryServiceFinder(bookName){
				for (var i=0; i<books.length; i++){
					if (books[i].name == bookName){ return books[i]; }
				}
				return -1;
			};
			
			var deferred = $q.defer();
			// This is mocking a db request by getting the info from a json static file on client side
			$http({ method: 'GET', url: '/data/books.json' })
				.then(function successCallback(response) { 
					books = response.data;
					var book = auxiliaryServiceFinder(bookName);
					if (book == -1) {
						var path = $location.path();
						$state.go('books.list', { path: path });
					}
					else { deferred.resolve(book); }
			  	}, function errorCallback(response) {
			  		$state.go('books.list'); // Lets supose a 404 not found
			});
			return deferred.promise;
		}
	}
});