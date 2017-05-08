angular.module('app').controller('FilterCtrl', function($scope, TypesService, IssuesService, $uibModalInstance) {
  var filterCtrl = this;
  filterCtrl.types = [];
  filterCtrl.selected = {
    types: [] //selected types
  };
  filterCtrl.typesSettings = {displayProp: 'description'};

  filterCtrl.dismiss = $uibModalInstance.dismiss;

  TypesService.getTypes().then(function(types) {
      filterCtrl.types = types;
      console.log(filterCtrl.types);
  });

  filterCtrl.submit = function() {
    IssuesService.setParams(saveCtrl.issue).then(function() {
      $uibModalInstance.close();
    });
  }
});
