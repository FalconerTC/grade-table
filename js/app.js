(function() {
  var app = angular.module('grade-table', ['ui.grid', 'ui.grid.edit', 'ngStorage']);

  var defaultUsers = [
	  {name: "Moroni", grade: 50},
	  {name: "Tiancum", grade: 43},
	  {name: "Jacob", grade: 27},
	  {name: "Nephi", grade: 29},
	  {name: "Enos", grade: 34}
	];

  app.controller('TableController', function($scope, $localStorage) {

  	$scope.storage = $localStorage.$default({
  		users: defaultUsers
  	});

  	$scope.gridOptions = {};

  	$scope.gridOptions.columnDefs = [
  		{ field: 'name', displayName: 'Name', 
  			cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
  				console.log(row);
  				if (grid.getCellValue(row, col ) < 50)
  					return 'failure';
  			}
  		},
  		{ field: 'grade', displayName: 'Grade', type: 'number', 
  			cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
  				if (grid.getCellValue(row, col) < 50)
  					return 'failure';
  			}
  		}
  	];

  	$scope.gridOptions.data = $scope.storage.users;

  });

})();