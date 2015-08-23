var socket = io();
socket.on('connect', function() {
  console.log('Connected!');
});
function initialize() {
  var earth = new WE.map('earth_div');
        earth.setView([46.8011, 8.2266], 2);
        WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
                tileSize: 256,
                bounds: [[-85, -180], [85, 180]],
                minZoom: 0,
                maxZoom: 16,
                attribution: 'WebGLEarth example',
                tms: true
              }).addTo(earth);
  // var marker = WE.marker([51.5, -0.09]).addTo(earth);
  // marker.bindPopup("<b>Hello world!</b><br>I am a popup.<br /><span style='font-size:10px;color:#999'>Tip: Another popup is hidden in Cairo..</span>", {maxWidth: 150, closeButton: true}).openPopup();
  var markerCustom = WE.marker([50, -9], '/img/logo-webglearth-white-100.png', 100, 24).addTo(earth);
  earth.setView([51.505, 0], 3);
  socket.on('tweets', function(data) {
    var marker = WE.marker([data.coordinates[1], data.coordinates[0]]).addTo(earth);
    marker.bindPopup("<b>"+ data.screen_name +"</b><br><br /><span style='font-size:10px;color:#999'>"+data.text+"</span>", {maxWidth: 150, closeButton: true}).openPopup();
  });
}
