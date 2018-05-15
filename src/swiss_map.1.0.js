// create svg canvas
const canvHeight = 600, canvWidth = 960;
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
    .attr("transform", `translate(${margin.left},${margin.top})`);

// chart title
svg.append("text")
    .attr("id", "chart-title")
    .attr("y", 0)
    .attr("x", margin.left)
    .attr("dy", "1.5em")
    .text("Switzerland");

////-------------------------- Entry Point ------------------------


export function initSwissMap(cantonNames /*, dataGroupedByYear*/){
    doPlot(cantonNames);
}

////-------------------------- StateData ------------------------
export const selectedCantons = [];

function createSelectedCantonObj(cantonId) {
    return {
        iso: cantonId,
        isSelected: false // on page loaded, must be false.
    }
}

function populateSelectedCantons(cantonIDs) {
    //fill up with SelectedCantonObj.
    console.log("IDs in createSelectedCantonsChecklist:");
    console.log(cantonIDs);

    //sort both arrays:
    console.log("sorted?");
    const sortedCantonIDs = cantonIDs.sort();
    console.log(sortedCantonIDs);

    sortedCantonIDs.forEach( function(id) {
        selectedCantons.push( createSelectedCantonObj(id) );
    });

    console.log("populated selectedCantons?");
    console.log(selectedCantons);
}


//------------------------ EventHandler Callbacks -------------------------


// Create Event Handlers for mouse
function mouseover(cantonId) {

    console.log("moving over " + cantonId);
}

function mouseout(cantonId) {

    console.log("moving out of " + cantonId);
}

function click(cantonId) {

    console.log("CLICKED ON " + cantonId);
}


function doPlot(cantonNames) {
    var projection = d3.geoAlbers()  // Albers is best at lat 45°
        .rotate([0, 0])       // rotate around globe by lat and long
        .center([8.3, 46.8])  // lat and long in degrees
        .scale(10000)         // zoom into small switzerland, depends on the projection
        .translate([width / 2, height / 2])  // move to center of map
        .precision(.1);


    d3.queue()
        .defer(d3.json, "./data/readme-swiss.json")
        .await(function(error, topology) {
            var cantons = topojson.feature(topology, topology.objects.cantons);
            console.log("Map loaded data?");
            console.log(topology);
            console.log(cantons);

            var pathGenerator = d3.geoPath().projection(projection);
            g.append("path")

            var cantonIDs = cantons.features.map(function(e){
                return e.id;
            });

            populateSelectedCantons(cantonIDs);

            var cant = g.selectAll("path.canton")
                    .data(cantons.features)
                    .enter()
                    .append("path")
                    .attr("id", d=> d.id)
            .attr("class", "canton")
                .attr("d", pathGenerator);

            console.log("cant:");
            console.log(cant);

            cant.on("mouseover", d => mouseover(d.id));
            cant.on("mouseout", d => mouseout(d.id));
            cant.on("click", d => click(d.id));

            g.append("path")
                .datum(topojson.mesh(topology, topology.objects.cantons))
                .attr("class", "canton-boundary")
                .attr("d", pathGenerator);

            g.selectAll("text.canton-label")
                .data(cantons.features)
                .enter().append("text")
                .attr("class", "canton-label")
                .attr("transform", function(d) { return "translate(" + pathGenerator.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .text(function(d) { return d.properties.name; });
        });
}

