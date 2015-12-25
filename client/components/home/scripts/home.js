var home = angular.module('home', ['homeDirecives']);  

home.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
	    
	    //////////////////////////
		// State Configurations //
		//////////////////////////
	    
	     .state('home', {
	    	url: '/',
	        template: '<home></home>'
	    })
})