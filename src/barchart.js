d3.csv("/data/who-life-expectancy-by-country.csv", function(d) {
	//accessor function: offers full control on how you return each item.
	//console.log(d);
  return {
  	country: d.Country,
  	year: +d.Year,
  	life_expectancy: +d["Life expectancy at birth"],
  	female_life_expectancy: +d["Female life expectancy at birth"],
  	male_life_expectancy: +d["Male life expectancy at birth"]
  };
}, function(data) {
  //call functions to process your data here.
	console.log("processed data:")
	console.log(data);
	main(data);
});

//animated bachart: https://bl.ocks.org/mbostock/3885705
//Drawing a bar chart (horizontal): https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998


const main = function(data) {

	// create svg canvas
	const canvHeight = 600, canvWidth = 800;
	const svg = d3.select("body").append("svg")
	    .attr("width", canvWidth)
	    .attr("height", canvHeight)
	    .style("border", "1px solid");

	// calc the width and height depending on margins.
	const margin = {top: 50, right: 80, bottom: 50, left: 60};
	const width = canvWidth - margin.left - margin.right;
	const height = canvHeight - margin.top - margin.bottom;

	// create parent group and add left and top margin
	const g = svg.append("g")
	    .attr("id", "chart-area")
	    .attr("transform", "translate(" +margin.left + "," + margin.top + ")");


	// unwrangle the data
	const top_countries = unwrangleRawData(data, 25);
	console.log(top_countries);

	//write a title
	writeTitle(svg, margin);

	//create xScale
	const xScale = createXScale(g, width, canvWidth, height, canvHeight, margin);

	//create yScale
	const yScale = d3.scaleBand().range([height, 0])
//	      .domain([0, /*d3.max(_.map(data, d => d.life_expectancy))*/ 100]);
		.domain(top_countries.map(function(d) { return d.country; })).padding(0.1)


	const yAxis = d3.axisLeft(yScale);
	g.append("g")
    	.call(yAxis);


	var country_bars = g.selectAll("rect")
    .data(top_countries)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => 0 )	//wo auf x-Achse
      .attr("y", d => yScale(d.country) )	//wo auf y-Achse
      .attr("width", d => xScale(d.life_expectancy))	//wie breit? z.B. 60.5 Jahre
      .attr("height", d =>  yScale.bandwidth())
      .style("fill", "orange");		//Höhe: gemäss Breite der Skalaticks

      // Create tooltip
    const tooltip = createTooltip(country_bars);
}


const createTooltip = function(country_bars) {
	const tooltip = d3.select("body").append("div").classed("tooltip", true);

    country_bars.on("mouseover", function(d, i) {
        tooltip
            .html(`Country: ${d.country}<br/>`
                + `Life Expectancy: ${d.life_expectancy}<br/>` 
                + `Female: ${d.female_life_expectancy}<br/>` 
                + `Male: ${d.male_life_expectancy}` )
            .style("visibility", "visible")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
    .on("mouseout", function(d,i) {
        tooltip.style("visibility", "hidden")
    });
    return tooltip;
}


const createXScale = function (g, width, canvWidth, height, canvHeight, margin) {
	const xScale = d3.scaleLinear().rangeRound([0,width])
	      .domain([0, /*d3.max(_.map(data, d => d.life_expectancy))*/ 100]);

	const xAxis = d3.axisBottom(xScale);
	g.append("g") 
		.attr("id", "xAxis")
	    .attr("transform", "translate(0," + height + ")").call(xAxis);


	g.append("text")
		.attr("id", "xLabel")
	    .attr("x",0 + (canvHeight/2) + margin.left)	//ttb is x-Axis
	    .attr("y", 0 + (canvWidth/2) + 2 * margin.bottom + 20)				//ltr is y-Axis
	    .attr("dy", "1em")
	    .attr("font-family", "sans-serif")
	    .style("text-anchor", "middle")
	    .text("Life expectancy");
	return xScale;
}




const writeTitle = function(svg, margin) {
	svg.append("text")
    .attr("x", margin.left)
    .attr("y", 0)
    .attr("dy", "1.5em")  // line height
    .attr("font-family", "sans-serif")
    .attr("font-size", "24px")
    .style("text-anchor", "left")
    .text("Life Expectancy at Birth");
}

//returns the data in nested and sorted form as an array of objects.
// data: the raw data from an .svg
// nEntries: the amount of entries you want to be returned.
const unwrangleRawData = function(data, nEntries) {
		// Use d3.nest and d3.sort to group data by year and sort by life expectancy.
	const nested_data = d3.nest()
			.key(d => d.year)
			.sortValues((a,b) => d3.descending(a.life_expectancy, b.life_expectancy))
			//.entries(data)
			.object(data);	//instead of entries(). Entries erzeugt dictionary.
	console.log("Entering unwrangleRawData()");
	console.log(nested_data[2000]);
	console.log(nested_data[2000][100]); //Marocco
	console.log(nested_data[2000][100].life_expectancy); //Marocco.life_expectancy (= 68.6)
	/* [Erzeugte Datenstruktur:]
	*	nested_data[2000] -> Array an Länderobjekten
	*	nested_data[2000][0] -> 1. Element der Länderobjektarrays (= Japan)
	*	nested_data[2000][100].life_expectancy -> einzelnes Attribut eines Länderobj.
	*/

	//Zugang zu den Länderobjekten vereinfachen:
	const country_data = nested_data[2000];
	console.log(country_data);
	console.log(country_data[100]); //Marocco
	console.log(country_data[100].life_expectancy); //Marocco.life_expectancy (= 68.6)

	// reduce to top 12 countries
	return country_data.splice(0, nEntries);
}