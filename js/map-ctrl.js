angular.module('app').controller('MapCtrl', function($scope, IssuesService, $geolocation) {
  var MapCtrl = this;

  var map = this;
  map.editMode = false;
  map.cursor = 'auto'; // changes the cursor style
  map.markers = [];

  map.defaults = {
    zoomControl: false // the scroll wheel you shall use
  };

  $scope.$on('my-event', function(event, arg1) {
    console.log("coucou" + arg1);
  });

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
  map.toggleEditMode = function() {
    if (map.editMode) {
      map.editMode = false;
      map.cursor = 'auto'
    } else {
      map.editMode = true;
      map.cursor = 'crosshair';
    }
  }

/**
 * What happens when user clicks on canvas
 */
  $scope.$on('leafletDirectiveMap.click', function(event, args) {
    if (map.editMode) {
      console.log(args);
      map.toggleEditMode();
    }
  });

  $geolocation.getCurrentPosition()
    .then(function (position) {
      console.log(position)
    }, function (error) {
      console.log(error);
    })
});