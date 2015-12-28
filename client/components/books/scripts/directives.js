'use strict'

var booksDirectives = angular.module('booksDirectives', ['booksServices', 'yaru22.angular-timeago']);

booksDirectives.directive('booksIndexNavbar', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/books/views/books-index-navbar.html'
  };
});

booksDirectives.directive('pagination', function() {
  return {
    restrict: 'E',
    templateUrl: 'components/books/views/pagination.html'
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

booksDirectives.directive('relatedBooks', function($state, Books) {
  return {
    restrict: 'E',
    templateUrl: 'components/books/views/related-books.html',
    scope: { book: '=' },
    controller: function($scope) {
      // relatedBooks finds 3 books with the same genre and/or category
      // @ One way data binding
      Books.list().then(function(books) {
        $scope.relatedBooks = createRelatedBooksList(books);
        console.log($scope.relatedBooks);
      }, function(reason) { alert('Failed: ' + reason); });

      function createRelatedBooksList(books){
        var relatedBooks = [];
        for (var i=0; i < books.length; i++){
          if ((books[i].name != $scope.book.name) && (books[i].genre.name == $scope.book.genre.name) &&
              (books[i].genre.category == $scope.book.genre.category)){
            relatedBooks.push(books[i]);
          }
        }
        return relatedBooks;
      }
    }
  };
});

booksDirectives.directive('booksIndex', function(Books, $q, $filter) {
  return {
    restrict: 'E',
    templateUrl: 'components/books/views/books-index.html',
    controller: function($scope) {
      Books.list().then(function(books) {
        $scope.books = books;
        init();
      }, function(reason) { alert('Failed: ' + reason); });
      
      function init(){ 

        /**************/
        /**************/
        // PAGINATION //
        /**************/
        /**************/

        var itemsPerPage = 12; 
        $scope.pagedItems = []; $scope.currentPage = 0;
        $scope.pages = [0,1,2,3,4];

        $scope.groupToPages = function () {
          $scope.pagedItems = [];
          for (var i = 0; i < $scope.filteredItems.length; i++) {
              if (i % itemsPerPage === 0) { $scope.pagedItems[Math.floor(i / itemsPerPage)] = [ $scope.filteredItems[i] ]; }
              else { $scope.pagedItems[Math.floor(i / itemsPerPage)].push($scope.filteredItems[i]); }
          }
        };     
        $scope.prevPage = function () { 
          if ($scope.currentPage > 0) { $scope.currentPage--; }
          if (($scope.currentPage <= $scope.pages[0]) && ($scope.currentPage != 0)){
            for (var i=0; i < $scope.pages.length; i++){
              $scope.pages[i] = $scope.pages[i]-3;
            }
          }
        };
        $scope.nextPage = function () { 
          if ($scope.currentPage < $scope.pagedItems.length - 1) { 
            $scope.currentPage++;
          }
          if (($scope.currentPage >= $scope.pages[$scope.pages.length - 1 ]) && ($scope.currentPage != $scope.pagedItems.length -1)){
            for (var i=0; i < $scope.pages.length; i++){
              $scope.pages[i] = $scope.pages[i]+3;
            }
          }
        };
        $scope.setPage = function (page) {  $scope.currentPage = page; };
        $scope.setLast = function (lastPage){ $scope.pages = [lastPage -4 ,lastPage- 3, lastPage-2,lastPage -1,lastPage]; $scope.currentPage = lastPage; }
        $scope.setFirst = function (firstPage){ $scope.pages = [firstPage, firstPage +1 ,firstPage +2, firstPage +3,firstPage +4]; $scope.currentPage = firstPage; }
        
        /**************************/
        /**************************/
        // SEARCHING && FILTERING //
        /**************************/
        /**************************/

        $scope.categoryFilter = '';
        $scope.categoriesList = ['Fiction', 'Non-Fiction'];
        $scope.genreFilter = '';
        $scope.genresList = createGenresList($scope.books);

        $scope.filteredItems = [];

        function createGenresList (books){
          var genresList = [];
          var genresListObject = {}
          for (var i=0; i < books.length; i++){
            if (genresListObject[books[i].genre.name] == undefined){
              genresListObject[books[i].genre.name] = true;
              genresList.push(books[i].genre.name) 
            }
          }
          return genresList;
        }

        var cleanSearch = function(){ $scope.query = '' };

        $scope.search = function () {
          
          var searchMatch = function (haystack, needle) { if (!needle) { return true; } return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1; };
          cleanCategoryFilter();
          cleanGenreFilter();

          $scope.filteredItems = $filter('filter')($scope.books, function (item) {
            var searchByAuthorAndTitle = { 'bookName': item.name, 'authorName': item.author.name };
            for(var attr in searchByAuthorAndTitle) {
                if (searchMatch(searchByAuthorAndTitle[attr], $scope.query))
                  return true;
            }
            return false;
          });
          $scope.currentPage = 0;
          $scope.groupToPages();  // now group by pages

        };
        
        var cleanCategoryFilter = function(){ $scope.categoryFilter = ''};

        $scope.filterByCategory = function (category) {
          cleanSearch();
          cleanGenreFilter();
          if ($scope.categoryFilter == '') { 
            $scope.filteredItems = $scope.books;
          }
          else {
            $scope.filteredItems = $filter('filter')($scope.books, function (item) {
              var criteria = { 'bookCategory': item.genre.category };
              for(var attr in criteria) {
                if (criteria[attr] == $scope.categoryFilter) { return true; }
              }
              return false;
            });
          }
          $scope.currentPage = 0;
          $scope.pages = [0,1,2,3,4];
          $scope.groupToPages();  // now group by pages
        };

        var cleanGenreFilter = function(){ $scope.genreFilter = ''};

        $scope.filterByGenre = function (genre) {
          cleanSearch();
          cleanCategoryFilter();
          if ($scope.genreFilter == '') { 
            $scope.filteredItems = $scope.books;
          }
          else {
            $scope.filteredItems = $filter('filter')($scope.books, function (item) {
              var criteria = { 'bookGenre': item.genre.name };
              for(var attr in criteria) {
                if (criteria[attr] == $scope.genreFilter) { return true; }
              }
              return false;
            });
          }
          $scope.currentPage = 0;
          $scope.pages = [0,1,2,3,4];
          $scope.groupToPages();  // now group by pages
        };

        $scope.search();
      };
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