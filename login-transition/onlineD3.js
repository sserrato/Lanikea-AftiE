
<!DOCTYPE html>
<html>
    <head>
        <title>maptime</title>
        <style type="text/css">
        	html, body, #map{
        		width:100%;height:100%;margin:0;
        	}
        </style>
		<script type="text/javascript" src="/faye.js"></script>
		<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
		<script type="text/javascript">

	var client = new Faye.Client('/faye');


		</script>



    //RENDER MAP
var latlng = new google.maps.LatLng(0, 0); //this numbers sets the lat and long of the center of the map. UK 54, -4
var myOptions = {
    zoom: 2  // this number changes the zoom that the map starts at UK 6
  , center: latlng
  , mapTypeId: google.maps.MapTypeId.ROADMAP //ROADMAP can also be SATELLITE, HYBRID, or TERRAIN
};

var map = new google.maps.Map(document.getElementById("map"), myOptions);


client.subscribe('/tweet', function(message) {
  if(message.geo && message.geo.coordinates){
    placeMarker(message.geo.coordinates);
  }
});

function placeMarker(coords){
  var myLatlng = new google.maps.LatLng(coords[0],coords[1]);
  
    position: myLatlng,
    // animation: google.maps.Animation.DROP,
    map: map,
    icon: image
  });

  var image = '/images/dot_blue.png';


  var image = '/images/dot_blue.png';


  // Remove marker after 30 seconds

  setTimeout(function(){
    marker.setMap(null);
    delete marker;
  }, 30000);
}
