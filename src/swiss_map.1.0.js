import {toggleCSSClass} from "./helper_lib.js";
import {addCSSClass} from "./helper_lib.js";
import {removeCSSClass} from "./helper_lib.js";
import {updateCheckboxes} from "./region_selectors.js";
import {updateCantons} from "./point-to-point-chart.js";

const canvHeight = 375 / 2, canvWidth = 600 / 2;

// calc the width and height depending on margins.
const margin = {top: 50, right: 80, bottom: 50, left: 60};
const width = canvWidth - margin.left - margin.right;
const height = canvHeight - margin.top - margin.bottom;



const cantonLabelThreshold = 1.5;
var currentScaleFactor = 1;

//todo: 'var allTargetIDs = []' to store <div id="..."> to easily locate canton views when multiple maps are drawn.
//      e.g. allTargetIDs = ["swiss-mini-map", "swiss-map"]
//          const delimiter = "-"
// when to implement? When more than two maps are generated.

////-------------------------- main() Entry Point ------------------------


export function initSwissMap(){
    drawBy(1, "swiss-mini-map");
    drawBy(2, "swiss-map");

    d3.select('section#map-section')
        .on('mouseover', mouseOverMap)
        .on('mouseout', mouseOutOfMap);
}

////-------------------------- StateData: cantonsPM ------------------------
// holds the state of each canton whether it is selected or not.
export const cantonsPM = [];

function createCantonPM(cantonId) {
    return {
        iso: cantonId,
        isSelected: false // on page loaded, must be false.
    }
}

function populateCantonsPM(cantonIDs) {
    const sortedCantonIDs = cantonIDs.sort();
    sortedCantonIDs.forEach( function(id) {
        cantonsPM.push( createCantonPM(id) );
    });
}

/**
 * updates the state of all cantonPMs according to cantonISOs[] and
 * returns the updated cantonPMs.
 * @param cantonISOs such as ["AG", "BE", "TG"]. Defines which cantons will be updated.
 * @param checked whether the clicked checkbox is checked or not.
 * @returns {Array} updated cantonPMs.
 */
export function updateCantonsPM(cantonISOs, checked) {
    var cantons2update = filterCantonsBy(cantonISOs);
    if (checked) {
        cantons2update.forEach(e => e.isSelected = true);
    } else {
        cantons2update.forEach(e => e.isSelected = false);
    }
    return cantons2update
}

function filterCantonsBy(cantonISOs) {
    var selectedCantonPMs = [];
    for (var i = 0; i < cantonsPM.length; ++i) {
        for (var j = 0; j < cantonISOs.length; ++j) {
            if (cantonsPM[i].iso === cantonISOs[j]){
                selectedCantonPMs.push(cantonsPM[i]);
            }
        }
    }
    return selectedCantonPMs;
}


//------------------------ EventHandler Callbacks -------------------------

function mouseOverMap() {
    d3.select('div#swiss-mini-map')
        .style('display', 'none');
    d3.select('div#swiss-map')
        .style('display', 'block');
    d3.select('div#map-wrapper')
        .style('width', '75%');
    d3.selectAll('#swiss-regions section')
        .style('float', 'none');
    d3.select('#all-regions')
        .style('padding-top', '0');

}

function mouseOutOfMap() {
    d3.select('div#swiss-mini-map')
        .style('display', 'block');
    d3.select('div#swiss-map')
        .style('display', 'none');
    d3.select('div#map-wrapper')
        .style('width', 'initial');
    d3.selectAll('#swiss-regions section')
        .style('float', 'left');
    d3.select('#all-regions')
        .style('padding-top', '100px');
}



function click(cantonIdWithSuffix) {
    var currentCanton = cantonsPM.find( function(e) {
        return e.iso === getCantonIdFrom(cantonIdWithSuffix);
    });
    currentCanton.isSelected = !currentCanton.isSelected;

    //send Update command to line chart.
    updateCantons();

    toggleCSSClass(currentCanton.iso + "-swiss-mini-map", "selected-canton");
    toggleCSSClass(currentCanton.iso + "-swiss-map", "selected-canton");
    updateCheckboxes();
}


//------------------------ drawing the map -------------------------

function drawBy(scaleFactor, targetId) {
    // create svg canvas
    const svg = d3.select("#" + targetId).append("svg")
        .attr("id", "svg-" + targetId)
        .attr("height", canvHeight * scaleFactor);

    // create parent group and add left and top margin
    const g = svg.append("g")
        .attr("id", "chart-area-" + targetId)
        .attr("transform", `translate(${margin.left * scaleFactor},${margin.top * scaleFactor})`);

    var projection = d3.geoAlbers()  // Albers is best at lat 45°
        .rotate([0, 0])       // rotate around globe by lat and long
        .center([8.3, 46.8])  // lat and long in degrees
        .scale(5000 * scaleFactor)         // zoom into small switzerland, depends on the projection
        .translate([ (width * scaleFactor) / 2, (height * scaleFactor)/ 2])  // move to center of map
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
            populateCantonsPM(cantonIDs);

            console.log("console ids");
            console.log(cantonIDs);

            var cant = g.selectAll("path.canton")
                    .data(cantons.features)
                    .enter()
                    .append("path")
                    .attr("id", d=> d.id + "-" + targetId)
            .attr("class", "canton")
                .attr("d", pathGenerator);

            //TODO: remove when no longer needed.
           // cant.on("mouseover", d => mouseover(d.id));
           // cant.on("mouseout", d => mouseout(d.id));
            cant.on("click", d => click(d.id + "-" + targetId));

            g.append("path")
                .datum(topojson.mesh(topology, topology.objects.cantons))
                .attr("class", "canton-boundary")
                .attr("d", pathGenerator);

            if (scaleFactor >= cantonLabelThreshold) {
                //draw labels.
                g.selectAll("text.canton-label")
                    .data(cantons.features)
                    .enter().append("text")
                    .attr("class", "canton-label")
                    .attr("transform", function(d) { return "translate(" + pathGenerator.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .text(function(d) { return d.properties.name; });
            }

        });
}


//------------------------ communication with region_selectors.js -------------------------

/**
 * updates cantonViews according to cantons2update.
 * @param cantons2update - an array of cantonPMs.
 * @param checked boolean.
 */
export function updateMapVisuals(cantons2update, checked){

    cantons2update.forEach( function(currentCanton){
        if (checked){
            addCSSClass(currentCanton.iso + "-swiss-mini-map", "selected-canton");
            addCSSClass(currentCanton.iso + "-swiss-map", "selected-canton");
        } else {
            removeCSSClass(currentCanton.iso + "-swiss-mini-map", "selected-canton");
            removeCSSClass(currentCanton.iso + "-swiss-map", "selected-canton");
        }
    });


}

//---------------- helper function: makes cantonPM.iso comparable to <path id=iso+"-swiss-(mini-)map"> ----------------
function getCantonIdFrom(cantonIdWithSuffix) {
    return cantonIdWithSuffix.substring(0, cantonIdWithSuffix.indexOf('-'));
}