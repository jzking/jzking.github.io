//https://d3-graph-gallery.com/graph/scatter_basic.html
//https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097 lin-reg

function onScatterShow() {
// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 30, left: 60},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("death_geo.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 500])
    .range([ 0, width ]);
  
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 90000])
    .range([ height, 0]);
  
  svg.append("g")
    .call(d3.axisLeft(y).tickFormat(d3.format("$,d")));

  // Add the tooltip container to the vis container
  // it's invisible and its position/contents are defined during mouseover
  var tooltip = d3.select("#scatter").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // tooltip mouseover event handler
  var tipMouseover = function(d) {
    var html  = "State: " + d.state + "<br/>" +
              "Deaths per capita: " + d.deaths + "</br>" +
              "Median income: " + d3.format("$,d")(d.income);
     tooltip.html(html)
    .style("left", (d3.event.pageX + 15) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
      .transition()
      .duration(50) // ms
      .style("opacity", .9); // started as 0!
  };

    // tooltip mouseout event handler
  var tipMouseout = function(d) {
      tooltip.transition()
          .duration(300) // ms
          .style("opacity", 0); // don't care about position!
  };



  // Add dots
  var circle = svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.deaths); } )
      .attr("cy", function (d) { return y(d.income); } )
      .attr("r", 5)
      .style("fill", "#69b3a2")
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);
  
  function expandCircle() {
    circle
        .transition()
        .duration(1000)
        .attr('r', 5)
        .on('end', contractCircle);
  }

  function contractCircle() {
    circle
        .transition()
        .duration(1000)
        .attr('r', 3)
        .on('end', expandCircle);
  }

    expandCircle();

})

}