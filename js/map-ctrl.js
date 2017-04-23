angular.module('app').controller('MapCtrl', function( $scope, $geolocation ) {
  var map = this;
  map.editMode = false;
  map.cursor = 'auto'; // changes the cursor style

  map.defaults = {
    zoomControl: false // the scroll wheel you shall use
  };

  map.center = {
    // These are the coordinates for the center of Yverdon-les-Bains
    lat: 46.778474,
    lng: 6.641183,
    zoom: 15 // This one is actually optional
  }

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