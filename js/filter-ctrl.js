angular.module('app').controller('FilterCtrl', function($scope, TypesService, IssuesService, $uibModalInstance) {
  var filterCtrl = this;
  filterCtrl.types = [];
  filterCtrl.selected = {
    types: []
  };
  //TODO Cancel filter
  filterCtrl.typesSettings = {displayProp: 'description'};

  filterCtrl.dismiss = $uibModalInstance.dismiss;

  TypesService.getTypes().then(function(types) {
    filterCtrl.types = types;
  });

  filterCtrl.submit = function() {
    var query = {
      issueType: {
        $in: _.map(filterCtrl.selected.types, 'id')
      }
    }
    console.log(query);
    IssuesService.setFilter(query);
    $uibModalInstance.close();
  }
});
