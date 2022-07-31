//https://github.com/scotthmurray/d3-book/blob/4cbba7c74ebd29e6a07ec25150bf0ddb6e108112/chapter_14/05_choropleth.html
//https://stackoverflow.com/questions/41688451/add-labels-to-a-map-using-d3js

function onOverviewShow() {
	//Width and height
	var w = 900;
	var h = 600;

	//Define map projection
	var projection = d3.geoAlbersUsa()
						.translate([w/2, h/2])
						.scale([1200]);

	//Define path generator
	var path = d3.geoPath()
					.projection(projection);
					
	//Define quantize scale to sort data values into buckets of color
	var color = d3.scaleLinear()
						.range(['white','darkred']);
						//Colors derived from ColorBrewer, by Cynthia Brewer, and included in
						//https://github.com/d3/d3-scale-chromatic

	//Create SVG element
	var svg = d3.select("#overview")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	//Load covid data
	d3.csv("death_geo.csv", function(data) {
		// Add the tooltip container to the vis container
		// it's invisible and its position/contents are defined during mouseover
		var tooltip = d3.select("#overview").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

		// tooltip mouseover event handler
		var tipMouseover = function(d) {
			var html  = "State: " + d.state;
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

		//Set input domain for color scale
		color.domain([
			d3.min(data, function(d) { return d.deaths; }), 
			d3.max(data, function(d) { return d.deaths; })
		]);

		//Load in GeoJSON data
		d3.json("us-states.json", function(json) {

			//Merge the ag. data and GeoJSON
			//Loop through once for each ag. data value
			for (var i = 0; i < data.length; i++) {
		
				//Grab state name
				var dataState = data[i].state;
				
				//Grab data value, and convert from string to float
				var dataValue = parseFloat(data[i].deaths);
		
				//Find the corresponding state inside the GeoJSON
				for (var j = 0; j < json.features.length; j++) {
				
					var jsonState = json.features[j].properties.name;
		
					if (dataState == jsonState) {
				
						//Copy the data value into the JSON
						json.features[j].properties.value = dataValue;
						
						//Stop looking through the JSON
						break;
						
					}
				}		
			}

			//Bind data and create one path per GeoJSON feature
			svg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("fill", function(d) {
					//Get data value
					var value = d.properties.value;
					
					if (value) {
						//If value exists…
						return color(value);
					} else {
						//If value is undefined…
						return "#ccc";
					}
			})

			labels = svg.selectAll("text")
				.data(data)
				.enter().append("text")
				.attr("class", "place-label")
				.text(function(d) { return d.deaths; })
				.attr("x", function(d) {
					return projection([d.lon, d.lat])[0];
				})
				.attr("y", function(d) {
					return projection([d.lon, d.lat])[1];
				})
				.attr("text-anchor","middle")
				.attr("font-size","12px")
				.on("mouseover", tipMouseover)
				.on("mouseout", tipMouseout);
			
			function expandLables() {
				labels
					.transition()
					.duration(1000)
					.attr("font-size","12px")
					.on('end', contractLabels);
				}
			
			function contractLabels() {
			  labels
				.transition()
				.duration(1000)
				.attr("font-size","22px")
				.on('end', expandLables);
			}
		
			expandLables();
		


		});
	
		

	});

}

