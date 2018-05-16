import {selectedCantons} from "./swiss_map.1.0.js";
import {updateMapVisuals} from "./swiss_map.1.0.js";

/**
 * deals with form#swiss-regions checkboxes
 */

const regions = [
    //BFS regions
    { name: "Ostschweiz",       code: "OCH",    cantons: ["AI","AR","GL","GR","SG","SH","TG"]},
    { name: "Zuerich",          code: "ZH",     cantons:["ZH"]},
    { name: "Zentralschweiz",   code: "ZS",     cantons:["LU", "NW", "OW", "SZ", "UR", "ZG"]},
    { name: "Nordwestschweiz",  code: "NW",     cantons:["AG", "BL", "BS"]},
    { name: "EspaceMittelland", code: "EML",    cantons:["BE", "FR", "JU", "NE", "SO"]},
    { name: "Genferseeregion",  code: "GSR",    cantons:["GE", "VD", "VS"]},
    { name: "Tessin",           code: "TI",     cantons:["TI"]},
    // topographical regions
    { name: "Jura",             code: "Jura",   cantons:["BL", "JU", "NE", "SO"]},
    { name: "Mittelland",       code: "Mittelland", cantons:["AG", "BS", "FR", "GE", "SH", "TG", "VD", "ZG", "ZH"]},
    { name: "Alpen",            code: "Alpen",  cantons:["AI", "AR", "BE", "GL", "GR", "LU", "NW", "OW", "SG", "SZ", "TI", "UR", "VS"]},
    //whole country of CH
    { name: "Schweiz",          code: "CH",
        cantons: ["AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR", "JU", "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG", "TI", "UR", "VD", "VS", "ZG", "ZH"]
    }
];

export function setupRegionSelectors() {
    //strategy:
    //1. prepare dictionaries like dict<region-code, iso[]>. See var regions.

    /* Potentially helpful links
    *   http://jsfiddle.net/fjaeger/L9z9t04p/4/
    *   https://stackoverflow.com/questions/5539139/change-get-check-state-of-checkbox
    *   https://blog.garstasio.com/you-dont-need-jquery/events/
    * *//*
    console.log("test getElementBy");
    console.log( d3.selectAll('#swiss-regions input')._groups.shift());
    var allCheckboxes = d3.selectAll('#swiss-regions input')._groups.shift();
    allCheckboxes.forEach( function(e){
       e.checked = true;
    });*/

    //2. get checkbox elements from DOM.
    var checkboxSelection = d3.selectAll('#swiss-regions input');

    //3. using d3's on(), register eventhandlers and define callback functions.
    /* Helpful links:
    *  http://www.tutorialsteacher.com/d3js/event-handling-in-d3js
    *  https://stackoverflow.com/questions/28723447/getting-the-properties-of-an-element-in-d3-is-not-elegant
    *  https://stackoverflow.com/questions/19849738/checkbox-check-uncheck-using-d3
    * */
    checkboxSelection.on("click", updateMap);
}


function updateMap() {
    // TODO:
    // 1. Find out, which checkbox has been clicked.
    // 2. update selectedCantons from swiss-map.1.0.js
    // 3. update map visuals
    // 4. inform line graph.

    console.log("updateMap:");

    //    var cbAsSelection = d3.select(this);

    var checkbox = this;
    var checkboxCode = checkbox.getAttribute('value');
    var cantonList = regions.find(r => r.code === checkboxCode).cantons;
    console.log(checkboxCode);
    console.log(cantonList);
    var relevantCantons = updateSelectedCantons(cantonList, checkbox.checked);
    updateMapVisuals(relevantCantons, checkbox.checked);
}

function updateSelectedCantons(cantonList, checked) {
    //1. get all relevant selectedCantons which are listed in cantonList
    //2. set their isSelected attribute according to checked.
    var relevantCantons = [];
    for (var i = 0; i < selectedCantons.length; ++i) {
        for (var j = 0; j < cantonList.length; ++j) {
            if (selectedCantons[i].iso === cantonList[j]){
                relevantCantons.push(selectedCantons[i]);
            }
        }
    }
    console.log("found cantons:");
    if (checked) {
        relevantCantons.forEach(e => e.isSelected = true);
    } else {
        relevantCantons.forEach(e => e.isSelected = false);
    }
    console.log(relevantCantons);
    return relevantCantons

}

function click() {
    console.log("inside click");
    console.log(d3.select(this));
    console.log(this);
}