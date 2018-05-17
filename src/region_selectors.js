import {cantonsPM} from "./swiss_map.1.0.js";
import {updateMapVisuals} from "./swiss_map.1.0.js";
import {updateCantonsPM} from "./swiss_map.1.0.js";
import {createHtmlInputElementOfType} from "./helper_lib.js";

/**
 * deals with form#swiss-regions checkboxes
 */

//1. prepare dictionaries like dict<region-code, iso[]>.
const regions = [
    //BFS regions
    { name: "Ostschweiz",       code: "_OCH",   parentId: "bfs-regions",    cantons: ["AI","AR","GL","GR","SG","SH","TG"]},
    { name: "Zuerich",          code: "_ZH",    parentId: "bfs-regions",    cantons:["ZH"]},
    { name: "Zentralschweiz",   code: "_ZS",    parentId: "bfs-regions",    cantons:["LU", "NW", "OW", "SZ", "UR", "ZG"]},
    { name: "Nordwestschweiz",  code: "_NW",    parentId: "bfs-regions",    cantons:["AG", "BL", "BS"]},
    { name: "EspaceMittelland", code: "_EML",   parentId: "bfs-regions",    cantons:["BE", "FR", "JU", "NE", "SO"]},
    { name: "Genferseeregion",  code: "_GSR",   parentId: "bfs-regions",    cantons:["GE", "VD", "VS"]},
    { name: "Tessin",           code: "_TIC",   parentId: "bfs-regions",    cantons:["TI"]},
    // topographical regions
    { name: "Jura",             code: "_Jura",      parentId: "topographical-regions",    cantons:["BL", "JU", "NE", "SO"]},
    { name: "Mittelland",       code: "_Mittelland",parentId: "topographical-regions",    cantons:["AG", "BS", "FR", "GE", "SH", "TG", "VD", "ZG", "ZH"]},
    { name: "Alpen",            code: "_Alpen",     parentId: "topographical-regions",    cantons:["AI", "AR", "BE", "GL", "GR", "LU", "NW", "OW", "SG", "SZ", "TI", "UR", "VS"]},
    //whole country of CH
    { name: "Schweiz",          code: "_CH",    parentId: "all-regions",
        cantons: ["AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR", "JU", "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG", "TI", "UR", "VD", "VS", "ZG", "ZH"]
    }
];

//2. get checkbox elements from DOM.
var checkboxSelection;

//--------------------------- main() Entry Point -------------------------

export function setupRegionSelectors() {
    regions.forEach( region => {
        createHtmlInputElementOfType("checkbox", region.name, region.code, region.code, region.name, region.parentId, true);
    });
    checkboxSelection = d3.selectAll('#swiss-regions input');
    checkboxSelection.on("click", handleUserInput);
}

//------------------------ EventHandler Callbacks -------------------------


function handleUserInput() {
    var checkbox = this;
    var checkboxCode = checkbox.getAttribute('value');
    var cantonISOs = regions.find(r => r.code === checkboxCode).cantons;

    updateMap(checkbox, cantonISOs);
    updateCheckboxes();
}

export function updateCheckboxes() {
    //get iso codes of all currently selected cantons.
    var currentlySelectedISOs = cantonsPM.filter(e => e.isSelected === true)
        .map(e => {return e.iso});

    //check which checkbox must be active or not...
    regions.forEach(function(region){
        //in region.cantons schauen, ob all ihre iso's in currentlySelectedISOs enthalten sind.
        var checkCurrentRegion = true;
        for (var i = 0; i < region.cantons.length; ++i){
            if( !currentlySelectedISOs.includes(region.cantons[i]) ) {
                checkCurrentRegion = false;
                break;
            }
        }
        // toggle the checked property of the <input> element.
        d3.select('#' + region.code).property('checked', checkCurrentRegion);
    });
}


function updateMap(checkbox, cantonISOs) {
    // 1. Find out, which checkbox has been clicked.
    // 2. update cantonsPM from swiss-map.1.0.js
    // 3. update map visuals
    // 4. inform line graph.
    var updatedCantons = updateCantonsPM(cantonISOs, checkbox.checked);
    updateMapVisuals(updatedCantons, checkbox.checked);


    //TODO: inform line graph.
}



//how to select html item within d3.on() callback function.:
function click() {
    //Todo: remove when no longer needed and documented.
    console.log("inside click");
    console.log(d3.select(this));
    console.log(this);
}