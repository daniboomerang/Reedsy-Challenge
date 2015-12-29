'use strict'

var homeDirecives = angular.module('homeDirecives', []);  

homeDirecives.directive('home', function() {
	return {
		restrict: 'E',
		templateUrl: 'components/home/views/home.html'
	};
});

homeDirecives.directive('reedsyChallengeDescription', function() {
	return {
		restrict: 'E',
		templateUrl: 'components/home/views/reedsy-challenge-description.html'
	};
});

homeDirecives.directive('techDescription', function() {
	return {
		restrict: 'E',
		templateUrl: 'components/home/views/tech-description.html'
	};
});

homeDirecives.directive('frontEndDescription', function() {
	return {
		restrict: 'E',
		templateUrl: 'components/home/views/front-end-description.html'
	};
});

homeDirecives.directive('backEndDescription', function() {
	return {
		restrict: 'E',
		templateUrl: 'components/home/views/back-end-description.html'
	};
});