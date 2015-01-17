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
  		{ name: 'name', displayName: 'Name' },
  		{ name: 'grade', displayName: 'Grade', type: 'number'}
  	];


  	$scope.gridOptions.data = $scope.storage.users;

  });

})();