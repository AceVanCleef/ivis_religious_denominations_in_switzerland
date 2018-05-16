import {cantonsPM} from "./swiss_map.1.0.js";
import {updateMapVisuals} from "./swiss_map.1.0.js";

/**
 * deals with form#swiss-regions checkboxes
 */

//1. prepare dictionaries like dict<region-code, iso[]>.
const regions = [
    //BFS regions
    { name: "Ostschweiz",       code: "_OCH",    cantons: ["AI","AR","GL","GR","SG","SH","TG"]},
    { name: "Zuerich",          code: "_ZH",     cantons:["ZH"]},
    { name: "Zentralschweiz",   code: "_ZS",     cantons:["LU", "NW", "OW", "SZ", "UR", "ZG"]},
    { name: "Nordwestschweiz",  code: "_NW",     cantons:["AG", "BL", "BS"]},
    { name: "EspaceMittelland", code: "_EML",    cantons:["BE", "FR", "JU", "NE", "SO"]},
    { name: "Genferseeregion",  code: "_GSR",    cantons:["GE", "VD", "VS"]},
    { name: "Tessin",           code: "_TIC",     cantons:["TI"]},
    // topographical regions
    { name: "Jura",             code: "_Jura",   cantons:["BL", "JU", "NE", "SO"]},
    { name: "Mittelland",       code: "_Mittelland", cantons:["AG", "BS", "FR", "GE", "SH", "TG", "VD", "ZG", "ZH"]},
    { name: "Alpen",            code: "_Alpen",  cantons:["AI", "AR", "BE", "GL", "GR", "LU", "NW", "OW", "SG", "SZ", "TI", "UR", "VS"]},
    //whole country of CH
    { name: "Schweiz",          code: "_CH",
        cantons: ["AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR", "JU", "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG", "TI", "UR", "VD", "VS", "ZG", "ZH"]
    }
];

//2. get checkbox elements from DOM.
const checkboxSelection = d3.selectAll('#swiss-regions input');


export function setupRegionSelectors() {
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

    //3. using d3's on(), register eventhandlers and define callback functions.
    /* Helpful links:
    *  http://www.tutorialsteacher.com/d3js/event-handling-in-d3js
    *  https://stackoverflow.com/questions/28723447/getting-the-properties-of-an-element-in-d3-is-not-elegant
    *  https://stackoverflow.com/questions/19849738/checkbox-check-uncheck-using-d3
    * */
    checkboxSelection.on("click", handleUserInput);
}

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
    var relevantCantons = updateCantonsPM(cantonISOs, checkbox.checked);
    updateMapVisuals(relevantCantons, checkbox.checked);


    //TODO: inform line graph.
}

/**
 *
 * @param cantonISOs array of Kantonskürzel of all currently selected cantons. e.g. "ZH"
 * @param checked whether the clicked checkbox is checked or not.
 * @returns {Array} elements of the cantonsPM array from swiss_map.1.0.js
 *                  which fullfill the criteria 'isSelected === true'.
 */
function updateCantonsPM(cantonISOs, checked) {
    //1. get all relevant cantonsPM which are listed in cantonISOs
    //2. set their isSelected attribute according to checked.
    var cantons2update = filterCantonsBy(cantonISOs);
    console.log("found cantons:");
    if (checked) {
        cantons2update.forEach(e => e.isSelected = true);
    } else {
        cantons2update.forEach(e => e.isSelected = false);
    }
    console.log(cantons2update);
    return cantons2update

}

//TODO: move to swiss_map.js
function filterCantonsBy(cantonISOs) {
    var relevantCantons = [];
    for (var i = 0; i < cantonsPM.length; ++i) {
        for (var j = 0; j < cantonISOs.length; ++j) {
            if (cantonsPM[i].iso === cantonISOs[j]){
                relevantCantons.push(cantonsPM[i]);
            }
        }
    }
    return relevantCantons;
}

//how to select html item within d3.on() callback function.:
function click() {
    //Todo: remove when no longer needed and documented.
    console.log("inside click");
    console.log(d3.select(this));
    console.log(this);
}