angular.module('app').controller('FilterCtrl', function($scope, IssuesService, $uibModalInstance) {
  var filterCtrl = this;
  filterCtrl.types = [];
  filterCtrl.selectedTypes = [];
  filterCtrl.filterSettings = {displayProp: 'description'};

  filterCtrl.dismiss = $uibModalInstance.dismiss;

  IssuesService.getTypes().then(function(types) {
      filterCtrl.types = types;
      console.log(filterCtrl.types);
  });

});
