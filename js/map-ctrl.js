angular.module('app').controller('MapCtrl', function( $scope, IssuesService, $geolocation ) {
  var map = this;
  map.editMode = false;
  map.cursor = 'auto'; // changes the cursor style

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
    icon: "tag",
    markerColor: "red"
  }
  
  IssuesService.getIssues().then(function(issues) {
    _.each(issues, function(issue) {
        map.markers.push({
          lat: issue.location.coordinates[1],
          lng: issue.location.coordinates[0],
          icon: defaultIcon
        });
      });
  });
  

  map.markers = [
    {
      lat: 46.778474,
      lng: 6.641183,
      icon: defaultIcon
    }
  ]

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