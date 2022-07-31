//https://d3-graph-gallery.com/graph/line_filter.html
//http://bl.ocks.org/williaster/af5b855651ffe29bdca1

function onRegionShow() {
    document.getElementById("regionMenu").options.length = 0;
    var margin = {top: 20, right: 30, bottom: 30, left: 60},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#regions")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("death_geo.csv", function(data) {

  var allGroup = d3.map(data, function(d){return(d.region)}).keys();

  // add the options to the button
  d3.select("#regionMenu")
    .selectAll('myOptions')
   	.data(allGroup)
    .enter()
  	.append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
  
  
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
  var tooltip = d3.select("#regions").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // tooltip mouseover event handler
  var tipMouseover = function(d) {
    var html  = "State: " + d.state + "</br>" +
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
    .data(data.filter(function(d){return d.region==allGroup[0];}))
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.deaths); } )
      .attr("cy", function (d) { return y(d.income); } )
      .attr("r", 5)
      .style("fill", "#69b3a2")
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);

  // A function that update the chart
  function update(selectedGroup) {
       // Create new data with the selection?
      var dataFilter = data.filter(function(d){return d.region==selectedGroup;})
      svg.selectAll("circle").remove();
      // Give these new data to update line
      circle = svg.append('g')
          .selectAll("dot")
          .data(dataFilter)
          .enter()
          .append("circle")
            .attr("cx", function(d) { return x(d.deaths) })
            .attr("cy", function (d) { return y(d.income) } )
            .attr("r", 5)
            .style("fill", "#69b3a2")
            .on("mouseover", tipMouseover)
            .on("mouseout", tipMouseout)
        }
    
    // When the button is changed, run the updateChart function
  d3.select("#regionMenu").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      // run the updateChart function with this selected option
      update(selectedOption);
  })

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
