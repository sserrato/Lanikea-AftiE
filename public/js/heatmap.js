var socket = io();

var map, heatmap;

function initialize() {
  var removeHeat = $('#removeHeat');
  var removeHeat2 = $('#allTweets');
  var removeHeat3 = $('#submitSearch');

  removeHeat.on('click', function(evt) {
    heatmap.setMap(null); //toggles the heatmap off
    heatmap.getData().j = []; // deletes the coordinates by emptying the array
    heatmap.setMap(map); // toggles the heatmap back on, now clear.
  });
  removeHeat2.on('click', function(evt) {
    heatmap.setMap(null); //toggles the heatmap off
    heatmap.getData().j = []; // deletes the coordinates by emptying the array
    heatmap.setMap(map); // toggles the heatmap back on, now clear.
  });
  removeHeat3.on('click', function(evt) {
    heatmap.setMap(null); //toggles the heatmap off
    heatmap.getData().j = []; // deletes the coordinates by emptying the array
    heatmap.setMap(map); // toggles the heatmap back on, now clear.
  });




  var latlng = new google.maps.LatLng(0, 0); //this numbers sets the lat and long of the center of the map. UK 54, -4
  var myOptions = {
      zoom: 2  // this number changes the zoom that the map starts at UK 6
    , center: latlng
    , mapTypeId: google.maps.MapTypeId.ROADMAP //ROADMAP can also be SATELLITE, HYBRID, or TERRAIN
  };

  map = new google.maps.Map(document.getElementById("map"), myOptions);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: [],
    dissipating: false, //this makes it so the heatmap won't dissipate as you zoom in
    radius: 3, //this number changes the size of the heatmap display
    map:map
  });

  socket.on('tweets', function(data) {
    // console.log(data.user);
    // console.log(data.text);
    // console.log(data);
    var myLatlng = new google.maps.LatLng(data.coordinates[1],data.coordinates[0]);
    heatmap.getData().push(myLatlng);
    });

}
