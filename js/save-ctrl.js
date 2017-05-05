angular.module('app').controller('SaveCtrl', function(latlng, $uibModalInstance, IssuesService) {
  var saveCtrl = this;
  saveCtrl.latlng = latlng;
  saveCtrl.close = $uibModalInstance.close;
  saveCtrl.types = [];


  IssuesService.getTypes().then(function(types) {
      saveCtrl.types = types;
      console.log(saveCtrl);
  });

});