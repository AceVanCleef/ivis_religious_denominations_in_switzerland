import {toggleCSSClass} from "./helper_lib.js";
import {addCSSClass} from "./helper_lib.js";
import {removeCSSClass} from "./helper_lib.js";
import {updateCheckboxes} from "./region_selectors.js";


// create svg canvas
const canvHeight = 375, canvWidth = 600;
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


export function initSwissMap(){
    doPlot();
}

////-------------------------- StateData ------------------------
// holds the state of each canton whether it is selected or not.
export const selectedCantons = [];

function createSelectedCantonObj(cantonId) {
    return {
        iso: cantonId,
        isSelected: false // on page loaded, must be false.
    }
}

function populateSelectedCantons(cantonIDs) {
    const sortedCantonIDs = cantonIDs.sort();
    sortedCantonIDs.forEach( function(id) {
        selectedCantons.push( createSelectedCantonObj(id) );
    });
}


//------------------------ EventHandler Callbacks -------------------------

function mouseover(cantonId) {

    console.log("moving over " + cantonId);
}

function mouseout(cantonId) {

    console.log("moving out of " + cantonId);
}

function click(cantonId) {
    console.log("CLICKED ON " + cantonId);
    var currentCanton = selectedCantons.find( function(e) {
        return e.iso === cantonId;
    });
    console.log(currentCanton.iso);
    currentCanton.isSelected = !currentCanton.isSelected;
    console.log(currentCanton.isSelected);

    //TODO: send Update command to line chart.
    // yourUpdateFunctoinHere();

    toggleCSSClass(currentCanton.iso, "selected-canton");
    updateCheckboxes();
}


//------------------------ drawing the map -------------------------

function doPlot() {
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

            var pathGenerator = d3.geoPath().projection(projection);
            g.append("path")

            var cantonIDs = cantons.features.map(function(e){
                return e.id;
            });
            populateSelectedCantons(cantonIDs);

            console.log("console ids");
            console.log(cantonIDs);

            var cant = g.selectAll("path.canton")
                    .data(cantons.features)
                    .enter()
                    .append("path")
                    .attr("id", d=> d.id)
            .attr("class", "canton")
                .attr("d", pathGenerator);

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


//------------------------ communication with region_selectors.js -------------------------

export function updateMapVisuals(relevantCantons, checked){

    relevantCantons.forEach( function(currentCanton){
        if (checked){
            addCSSClass(currentCanton.iso, "selected-canton");
        } else {
            removeCSSClass(currentCanton.iso, "selected-canton");
        }
    });


}