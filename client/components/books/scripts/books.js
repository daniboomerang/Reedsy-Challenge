'use strict'

var books = angular.module('books', ['booksDirectives']);  

books.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/books/', '/books');

	$stateProvider
	    
	    //////////////////////////
		// State Configurations //
		//////////////////////////
	    
        .state('books', {
        	abstract: true,
        	url: '/books',
			template: '<ui-view></ui-view>' // This is the 'Web Component' books
        })	
        	// Nested Views
        	.state('books.list', {
	        	url: '',
				template: '<books-index></books-index>' // This is the books Index
        	})
        	.state('books.open', {
	        	url: '/:bookName',
				template: '<book></book>'	// This is the Book
        	})
})


