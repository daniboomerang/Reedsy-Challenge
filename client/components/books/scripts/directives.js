var booksDirectives = angular.module('booksDirectives', ['booksServices']);  

booksDirectives.directive('booksIndex', function(Books, $q) {
  return {
    restrict: 'E',
    templateUrl: 'components/books/views/books-index.html',
    controller: function($scope) {
      Books.list().then(function(books) {
        $scope.books = books;
      }, function(reason) {
        alert('Failed: ' + reason);
      });
      $scope.orderList = "name"; 
    }
  };
});

booksDirectives.directive('bookIndexInfo', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/books/views/book-index-info.html',
    // Isolated scope. Input parameters from the parent. 
    // @ One way data binding
    scope: { cover: '@', name: '@', author: '@', votes: '@', published: '@' },
  };
});

booksDirectives.directive('book', function($state, Books) {
  return {
    restrict: 'E',
    templateUrl: 'components/books/views/book.html',
    controller: function($scope) {
      // Book directive display the title of the book passed in the URL
      // @ One way data binding
      var bookName = $state.params.bookName.split('-').join(' ')
      Books.open(bookName).then(function(book) {
        $scope.book = book;
      });
    }
  };
});

booksDirectives.directive('introductoryContents', function() {
  return {
    restrict: 'E',  
    templateUrl: 'components/books/views/introductory-contents.html',
    // Isolated scope. Input parameters from the parent. 
    // = We receive an array of objects
    scope: { introduction: '=' }  
  };
});