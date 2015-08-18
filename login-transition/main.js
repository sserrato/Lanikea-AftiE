d3.select("body").selectAll("div").data(dataset).enter().append("div").attr("class", "bar")
.style("margin-right", "2px")
.style("height", function(d){
  var barHeight = d*5;
  return barHeight + "px";
});

d3.select("body").selectAll("p")
.data(dataset)
.enter()
.append("p")
.text(function(d) { return "i can count up to " + d; })
.style("color", function(d){
  if(d<15) return "red";
  else return "black";
});



var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var circles = svg.selectAll("circle").data(dataset).enter().append("circle");
circles.attr("cx", function(d, i){
  return (i*60) + 25;
})
.attr("cy", h/2)
.attr("r", function(d){
  return d;
})
.attr("fill", "blue")
.attr("stroke", "lightblue");


d3.select("body").selectAll("div")
  .data(dataset)
  .enter()
  .append("div")
  .attr("class", "bar")
  .style("margin-right", "2px")
  .style("height", function(d) {
    var barHeight = d * 5;
    return barHeight + "px";
  })


  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
    return d;
    })
    .attr("x", function(d, i) {
      return i * (w / dataset.length) + (w / dataset.length - barPadding);
    })
    .attr("y", function(d) {
      return h - (d * 4) + 14;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "white")
    .attr("text-anchor", "middle")


    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function(d, i){
        return i*(w/dataset.length);
      })
      .attr("y", function(d){
        return h-(d*4);
      })
      .attr("height", function(d){
        return d*4;
      })
      .attr("width", function(d, i){
        return w/dataset.length-barPadding;
      })
      .attr("fill", function(d){
        return "rgb(0, 0, " + (d * 10) + ")";
      });
