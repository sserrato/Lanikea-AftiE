var socket = io();
socket.on('connect', function() {
  console.log('Connected!');
});
function initialize() {
  var earth = new WE.map('earth_div');
  WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(earth);
  // var marker = WE.marker([51.5, -0.09]).addTo(earth);
  // marker.bindPopup("<b>Hello world!</b><br>I am a popup.<br /><span style='font-size:10px;color:#999'>Tip: Another popup is hidden in Cairo..</span>", {maxWidth: 150, closeButton: true}).openPopup();
  var markerCustom = WE.marker([50, -9], '/img/logo-webglearth-white-100.png', 100, 24).addTo(earth);
  earth.setView([51.505, 0], 3);
  socket.on('tweets', function(data) {
    var marker = WE.marker(data.coordinates).addTo(earth);
    console.log(data);
    marker.bindPopup("<b>"+ data.screen_name +"</b><br><br /><span style='font-size:10px;color:#999'>"+data.text+"</span>", {maxWidth: 150, closeButton: true}).openPopup();
  });
}
