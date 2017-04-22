angular.module('app').controller('MapCtrl', function( $scope, $geolocation ) {
  var map = this;
  map.editMode = false;
  map.cursor = 'auto';

  map.defaults = {
    zoomControl: false
  };

  map.center = {
    // These are the coordinates for the center of Yverdon-les-Bains
    lat: 46.778474,
    lng: 6.641183,
    zoom: 15 // This one is actually optional
  }

  map.toggleEditMode = function() {
    if (map.editMode) {
      map.editMode = false;
      map.cursor = 'auto'
    } else {
      map.editMode = true;
      map.cursor = 'crosshair';
    }
  }

  $scope.$on('leafletDirectiveMap.click', function(event, args) {
    if (map.editMode) {
      console.log(args);
      map.toggleEditMode();
    } // Will give you the updated marker object
  });

  $geolocation.getCurrentPosition()
    .then(function (position) {
      console.log(position)
    }, function (error) {
      console.log(error);
    })
});