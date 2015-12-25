var homeDirecives = angular.module('homeDirecives', []);  

homeDirecives.directive('home', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/home/views/home.html'
  };
});