var booksDirectives = angular.module('booksDirectives', ['booksServices']);  

booksDirectives.directive('booksIndex', function(Books, $q, $filter) {
  return {
    restrict: 'E',
    templateUrl: 'components/books/views/books-index.html',
    controller: function($scope) {
      Books.list().then(function(books) {
        $scope.books = books;
        setupPagination()
      }, function(reason) {
        alert('Failed: ' + reason);
      });
      
      function setupPagination(){ 
        
        /*********/
        /* init  */
        /*********/
        $scope.sortingOrder = "name"; $scope.reverse = false; $scope.filteredItems = []; $scope.groupedItems = []; $scope.itemsPerPage = 6; $scope.pagedItems = []; $scope.currentPage = 0;
        /*********/

        var searchMatch = function (haystack, needle) { if (!needle) { return true; } return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1; };
        // init the filtered items
        $scope.search = function () {
          $scope.filteredItems = $filter('filter')($scope.books, function (item) {
            var searchByAuthorAndTitle = { 'bookName': item.name, 'authorName': item.author.name };
            for(var attr in searchByAuthorAndTitle) {
                if (searchMatch(searchByAuthorAndTitle[attr], $scope.query))
                  return true;
            }
            return false;
          });
          // take care of the sorting order
          if ($scope.sortingOrder !== '') { $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse); }
          $scope.currentPage = 0;
          $scope.groupToPages();  // now group by pages
        };
        
        // calculate page in place
        $scope.groupToPages = function () {
            $scope.pagedItems = [];
            for (var i = 0; i < $scope.filteredItems.length; i++) {
                if (i % $scope.itemsPerPage === 0) { $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ]; }
                else { $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]); }
            }
        };
        
        $scope.range = function (start, end) { var ret = []; if (!end) { end = start; start = 0; } for (var i = start; i < end; i++) { ret.push(i); } return ret; };
        $scope.prevPage = function () { if ($scope.currentPage > 0) { $scope.currentPage--; } };
        $scope.nextPage = function () { if ($scope.currentPage < $scope.pagedItems.length - 1) { $scope.currentPage++; } };
        $scope.setPage = function () { $scope.currentPage = this.n; };
        $scope.sort_by = function(newSortingOrder) { if ($scope.sortingOrder == newSortingOrder) { $scope.reverse = !$scope.reverse; } $scope.sortingOrder = newSortingOrder; };
        $scope.search();
      };
    }
  };
});

booksDirectives.directive('bookIndexInfo', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/books/views/book-index-info.html',
    // Isolated scope. Input parameters from the parent. 
    // @ One way data binding
    scope: { cover: '@', name: '@', author: '@', votes: '@', published: '@' }
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