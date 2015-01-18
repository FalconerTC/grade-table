(function() {
  var app = angular.module('grade-table', ['ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ngStorage']);

  var defaultUsers = [
	  { name: "Moroni", grade: 100 },
	  { name: "Tiancum", grade: 85 },
	  { name: "Jacob", grade: 40 },
	  { name: "Nephi", grade: 68 },
	  { name: "Enos", grade: 0 },
	  { name: "(new)", grade: '' }
	];

  app.controller('TableController', function($scope, $localStorage) {

  	$scope.storage = $localStorage.$default({
  		users: defaultUsers
  	});

  	$scope.gridOptions = { enableCellEditOnFocus : true};

  	$scope.gridOptions.columnDefs = [
  		{ field: 'name', displayName: 'Name' },
  		{ field: 'grade', displayName: 'Grade', type: 'number', 
  			cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
  				var value = grid.getCellValue(row, col);
  				if (value !== '' && value <= 65)
  					return 'failure';
  			}
  		}
  	];

  	$scope.gridOptions.onRegisterApi = function(gridApi){
	     $scope.gridApi = gridApi;
	     gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue){

	     	//Delete row if a field was left blank
	     	if ((newValue === '' || newValue === null) && rowEntity.name != "(new)") {
	     		var i, len;
	     		var key = rowEntity.$$hashKey;
	     		for(i = 0, len = $scope.gridOptions.data.length; i < len; i++) {
	     			if ($scope.gridOptions.data[i].$$hashKey === key) {
	     				$scope.gridOptions.data.splice(i, 1);
	     				break;
	     			}
	     		}
	     	} 
	     	//Add a new template row if it was used
	     	if (oldValue === "(new)" && newValue !== "(new)") {
	     		$scope.gridOptions.data.push({ name: "(new)", grade: '' });
	     	}
	      console.log('edited row id:' + rowEntity.$$hashKey+ ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
	     });
	   };

  	$scope.gridOptions.data = $scope.storage.users;

  });

})();