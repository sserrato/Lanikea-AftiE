var socket = io();

socket.on('connect', function() {
  console.log('Connected!');
});

function initialize() {
  // Create the Google Map…
  var latlng = new google.maps.LatLng(0, 0); //this numbers sets the lat and long of the center of the map. UK 54, -4
  var myOptions = {
      zoom: 2  // this number changes the zoom that the map starts at UK 6
    , center: latlng
    , mapTypeId: google.maps.MapTypeId.ROADMAP //ROADMAP can also be SATELLITE, HYBRID, or TERRAIN
  };
  var map = new google.maps.Map(document.getElementById("map"), myOptions);


  // Load the station data. When the data comes back, create an overlay.
  socket.on('tweets', function(data) {
    // console.log(data);
    var overlay = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay.onAdd = function() {
      var layer = d3.select(this.getPanes().overlayLayer).append("div")
      .attr("class", "stations");
      // Draw each marker as a separate SVG element.
      // We could use a single SVG, but what size would it have?
      overlay.draw = function() {
        var projection = this.getProjection(),
        padding = 10;

        var marker = layer.selectAll("svg")
        .data(d3.entries(data.coordinates))
        .each(transform) // update existing markers
        .enter().append("svg:svg")
        .each(transform)
        .attr("class", "marker");
        // Add a circle.
        marker.append("svg:circle")
        .attr("r", 2)
        .attr("cx", padding)
        .attr("cy", padding)
        .transition().remove().attr("r", 10).duration(3000)
        // .style("opacity", 0).duration(3000);
        // Add a label.
        // marker.append("svg:text")
        //     .attr("x", padding + 7)
        //     .attr("y", padding)
        //     .attr("dy", ".31em")
        //     .text(function(d) { return d.key; });
        function transform(d) {
          d = new google.maps.LatLng(data.coordinates[1],data.coordinates[0]);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
          .style("left", (d.x - padding) + "px")
          .style("top", (d.y - padding) + "px");
        }
      };
    };
    // Bind our overlay to the map…
    overlay.setMap(map);
  });
}
