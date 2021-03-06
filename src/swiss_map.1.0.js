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



//defines whether "Ganze Schweiz" checkboxes will be checked on page load.
export const initMapWithAllCantonsSelected = false;
// defines which individual cantons will be selected on page load.
const initWithFollowingCantons = ["UR"];

//stores the targetId suffixes. Add more if you want multiple maps. Remember: you need to add <div> elements with suitable IDs.
// Optionally: map scaleFactor and a corresponding <div> in index.html with ID. to automate it.
const allTargetIDs = ["swiss-map"];

// div#cantonLabel: informs user which canton he is currently hovering above.
var cantonLabel;

////-------------------------- main() Entry Point ------------------------


export function initSwissMap(){
    drawBy(1.75, allTargetIDs[0]);
    initMapStyle();

    //init div#cantonLabel
    cantonLabel = d3.select("div#cantonLabel");
    var mapWrapper = d3.select('div#map-wrapper');
    //solution by: https://bl.ocks.org/mbostock/1087001
    mapWrapper.on("mousemove", d => {
        //mouse position:
        let x = d3.event.pageX + 2;
        let y = d3.event.pageY  + 22;
        cantonLabel.style('left', x + 'px')
            .style('top', y + 'px');
    });
}

function initMapStyle() {
    d3.select('div#swiss-map');
    d3.selectAll('#swiss-regions section')
        .style('float', 'none');
    d3.select('#all-regions')
        .style('padding-top', '0');

}

////-------------------------- StateData: cantonsPM ------------------------
// holds the state of each canton whether it is selected or not.
export const cantonsPM = [];

function createCantonPM(cantonId) {
    return {
        iso: cantonId,
        isSelected: activateCanton(cantonId)
    }
}

function populateCantonsPM(cantonIDs) {
    const sortedCantonIDs = cantonIDs.sort();
    sortedCantonIDs.forEach( function(id) {
        //prevent duplicates.
        if (!cantonsPM.find(e => e.iso === id)){
            cantonsPM.push( createCantonPM(id) );
        }
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

function mouseOverCanton(pathElem) {
    console.log("mouseOver:");
    console.log(pathElem);

    cantonLabel.style('display', 'inherit');
    cantonLabel.select('p').html(pathElem.properties.name);
}

function mouseOutCanton(cantonIdWithSuffix) {
    cantonLabel.style('display', 'none');
}

function click(cantonIdWithSuffix) {
    var currentCanton = cantonsPM.find( function(e) {
        return e.iso === getCantonIdFrom(cantonIdWithSuffix);
    });
    currentCanton.isSelected = !currentCanton.isSelected;

    //send Update command to line chart.
    updateCantons();

    allTargetIDs.forEach(targetId => toggleCSSClass(currentCanton.iso + "-" + targetId, "selected-canton"));
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

            var cant = g.selectAll("path.canton")
                    .data(cantons.features)
                    .enter()
                    .append("path")
                    .attr("id", d=> d.id + "-" + targetId)
                    .attr("d", pathGenerator);

            //determine which canton has to be marked as selected
            cant.attr("class", c => defineClassListOf(c) );

            cant.on("click", d => click(d.id + "-" + targetId));
            cant.on("mouseover", d => {
                mouseOverCanton(d);
            });
            cant.on("mouseout", d => {
                mouseOutCanton(d);
            });

            g.append("path")
                .datum(topojson.mesh(topology, topology.objects.cantons))
                .attr("class", "canton-boundary")
                .attr("d", pathGenerator);


            //send Update command to line chart.
            updateCantons();
            //check whether region checkboxes have to be selected.
            updateCheckboxes();
        });

}

function defineClassListOf(c) {
    var str = "canton";
    if ( activateCanton(c.id) ) str = "canton selected-canton";
    return str;
}

//determines whether a canton has to be initiated on page load.
function activateCanton(iso) {
    return initWithFollowingCantons.includes(iso) || initMapWithAllCantonsSelected;
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
            allTargetIDs.forEach(targetId => addCSSClass(currentCanton.iso + "-" + targetId, "selected-canton"));
            /*addCSSClass(currentCanton.iso + "-swiss-mini-map", "selected-canton");
            addCSSClass(currentCanton.iso + "-swiss-map", "selected-canton");*/
        } else {
            allTargetIDs.forEach(targetId => removeCSSClass(currentCanton.iso + "-" + targetId, "selected-canton"));
            /*removeCSSClass(currentCanton.iso + "-swiss-mini-map", "selected-canton");
            removeCSSClass(currentCanton.iso + "-swiss-map", "selected-canton");*/
        }
    });


}


//---------------- helper function: makes cantonPM.iso comparable to <path id=iso+"-swiss-(mini-)map"> ----------------
function getCantonIdFrom(cantonIdWithSuffix) {
    return cantonIdWithSuffix.substring(0, cantonIdWithSuffix.indexOf('-'));
}