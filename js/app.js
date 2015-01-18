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

  app.controller('TableController', function($rootScope, $localStorage) {


  	$localStorage.$reset();
  	$rootScope.storage = $localStorage.$default({
  		users: defaultUsers
  	});

  	$rootScope.gridOptions = { enableCellEditOnFocus : true};

  	$rootScope.gridOptions.columnDefs = [
  		{ field: 'name', displayName: 'Name' },
  		{ field: 'grade', displayName: 'Grade', type: 'number', 
  			cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
  				var value = grid.getCellValue(row, col);
  				if (value !== '') {
	  				if (value < 65)
	  					return 'fail-grade';
	  				else if (value >= 65 && value < 80)
	  					return 'passing-grade';
	  				else if (value >= 80 && value < 90)
	  					return 'good-grade';
	  				else
	  					return 'excellent-grade';
	  			}
  			}
  		}
  	];

  	$rootScope.gridOptions.onRegisterApi = function(gridApi){
	     $rootScope.gridApi = gridApi;
	     gridApi.edit.on.afterCellEdit($rootScope, function(rowEntity, colDef, newValue, oldValue){
	     	if (newValue === "(new)")
	     		return;
	     	//Delete row if a field was left blank
	     	if ((newValue === '' || newValue === null) && rowEntity.name != "(new)") {
	     		var i, len;
	     		var key = rowEntity.$$hashKey;
	     		for(i = 0, len = $rootScope.gridOptions.data.length; i < len; i++) {
	     			if ($rootScope.gridOptions.data[i].$$hashKey === key) {
	     				$rootScope.gridOptions.data.splice(i, 1);
	     				break;
	     			}
	     		}
	     	} 
	     	//Add a new template row if it was used
	     	if (oldValue === "(new)" && newValue !== "(new)") {
	     		$rootScope.gridOptions.data.push({ name: "(new)", grade: '' });
	     	}
	     	console.log("Sending event");
	     	$rootScope.$broadcast('event', $rootScope.gridOptions.data);
	      //console.log('edited row id:' + rowEntity.$$hashKey+ ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
	     });
	   };

  	$rootScope.gridOptions.data = $rootScope.storage.users;

  	setTimeout(function(){
  	    $rootScope.$apply(function(){
  	        $rootScope.$broadcast('event', $rootScope.gridOptions.data);
  	    });
  	}, 1000);

  });

	app.controller('SummaryController', function($scope) {

		$scope.gridOptions = { enableCellEdit: false};

		$scope.gridOptions.columnDefs = [
			{ field: 'min', displayName: 'Min Grade', type: 'number' },
			{ field: 'max', displayName: 'Max Grade', type: 'number' },
			{ field: 'average', displayName: 'Average Grade', type: 'number' }
		];

		$scope.gridOptions.data = [{ min: 0, max: 0, average: 0 }];

		function updateData(data) {
			var i, len;
			var min, max, avg;
			for (i = 0, len = data.length; i < len; i++) {
				//Set defaults
				var grade = data[i].grade;
				if (grade !== '') {
					if (!i) {
						min = grade;
						max = grade;
						avg = grade;
					} else {
						if (grade < min)
							min = grade;
						if (grade > max)
							max = grade;
						avg = (avg * i + grade) / (i+1);
					}
				}
			}
			$scope.gridOptions.data = [{ min: min, max: max, average: avg }];
			
		}

		$scope.$on('event', function(event, data) {
			console.log("Received stuff");
			console.log(data);
			updateData(data);
		});

	});

})();