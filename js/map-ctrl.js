angular.module('app').controller('MapCtrl', function($scope, IssuesService, $geolocation, $uibModal) {
  var MapCtrl = this;

  var map = this;
  map.editMode = false;
  map.cursor = 'auto'; // changes the cursor style
  map.markers = [];

  map.defaults = {
    zoomControl: false // the scroll wheel you shall use
  };


  map.center = {
    // These are the coordinates for the center of Yverdon-les-Bains
    lat: 46.778474,
    lng: 6.63,
    zoom: 15 // This one is actually optional
  }

/**
 * Markers appearance
 */
  var defaultIcon = {
    type: "vectorMarker",
    icon: "coffee",
    markerColor: "red"
  }

  IssuesService.getIssues().then(function(issues) {
    _.each(issues, function(issue) {
        issue.icon = defaultIcon;
      });
      map.markers = issues;
  });



/**
 * This switches the edit mode on or off
 */
  map.toggleEditMode = function(on) {
    if (on) {
      map.editMode = true;
      map.cursor = 'crosshair'
    } else {
      map.editMode = false;
      map.cursor = 'auto';
    }
  }

/**
 * What happens when user clicks on canvas
 */
  $scope.$on('leafletDirectiveMap.click', function(event, args) {
    if (map.editMode) {
      console.log(args.leafletEvent.latlng);
      map.toggleEditMode();
      $uibModal.open({
        templateUrl: "templates/savemodal.html",
        controller: "SaveCtrl",
        controllerAs: "saveCtrl",
        resolve: {
          latlng: args.leafletEvent.latlng
        }
      });
    }
  });

  $scope.$on('leafletDirectiveMap.blur', function(event) {
    map.toggleEditMode();
  });

  $geolocation.getCurrentPosition()
    .then(function (position) {
      console.log(position)
    }, function (error) {
      console.log(error);
    })
});