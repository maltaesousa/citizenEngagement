angular.module('app').controller('SaveCtrl', function(latlng, $uibModalInstance, IssuesService, TypesService) {
  var saveCtrl = this;
  saveCtrl.dismiss = $uibModalInstance.dismiss;
  saveCtrl.types = []; // Types of issues to feed the combobox
  saveCtrl.tag = ""; // tag that will be pushed in the issue
  saveCtrl.issue = { // The issue data to be sent
      location: {
        coordinates: [ latlng.lng, latlng.lat ], // Point passed by the map-ctrl
        type: "Point" //TODO: handle this in the service
      }
  };

  /**
   * Get the existing types into the combobox
   */
  TypesService.getTypes().then(function(types) {
      saveCtrl.types = types;
  });

  /**
   * Creates an array or push to existing array of tags
   * No duplicates allowed
   */
  saveCtrl.addTag = function() {
    (saveCtrl.issue.tags = saveCtrl.issue.tags || []).push(saveCtrl.tag);
    saveCtrl.issue.tags = _.uniq(saveCtrl.issue.tags);
    saveCtrl.tag = "";
  }
  
  /**
   * Removes a specific tag from the array
   */
  saveCtrl.removeTag = function(tag) {
    _.pull(saveCtrl.issue.tags, tag);
  }

  /**
   * Saves the data
   */
  saveCtrl.submit = function() {
    IssuesService.setIssue(saveCtrl.issue).then(function() {
      $uibModalInstance.close();
    });
  }
});