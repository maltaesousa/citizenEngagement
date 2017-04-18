angular.module('app').controller('MapCtrl', function( $geolocation ) {
  var map = this;

  map.defaults = {};

  map.center = {
    // These are the coordinates for the center of Yverdon-les-Bains
    lat: 46.778474,
    lng: 6.641183,
    zoom: 15 // This one is actually optional
  }

  $geolocation.getCurrentPosition()
    .then(function (position) {
      console.log(position)
    }, function (error) {
      console.log(error);
    })
});