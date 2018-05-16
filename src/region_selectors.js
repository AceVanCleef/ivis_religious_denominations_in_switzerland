import {selectedCantons} from "./swiss_map.1.0.js";

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
    //1. prepare dictionaries like dict<region-code, iso[]>

    /* Potentially helpful links
    *   http://jsfiddle.net/fjaeger/L9z9t04p/4/
    *   https://stackoverflow.com/questions/5539139/change-get-check-state-of-checkbox
    *   https://blog.garstasio.com/you-dont-need-jquery/events/
    * */
    console.log("test getElementBy");
    console.log( d3.selectAll('#swiss-regions input')._groups.shift());
    var allCheckboxes = d3.selectAll('#swiss-regions input')._groups.shift();
    allCheckboxes.forEach( function(e){
       e.checked = true;
    });

    setUpEventHandlerFor( d3.selectAll('#swiss-regions input'),  click);
    //2. get checkbox elements from DOM.
    var checkboxSelection = d3.selectAll('#swiss-regions input');

    //3. using d3's on(), register eventhandlers and define callback functions.
    /* Helpful links:
    *  http://www.tutorialsteacher.com/d3js/event-handling-in-d3js
    *  https://stackoverflow.com/questions/28723447/getting-the-properties-of-an-element-in-d3-is-not-elegant
    *  https://stackoverflow.com/questions/19849738/checkbox-check-uncheck-using-d3
    * */
    checkboxSelection.on("click", click);
}

function setUpEventHandlerFor(d3Selection, callbackFunc) {
    //source: http://www.tutorialsteacher.com/d3js/event-handling-in-d3js

    console.log("d3 d3Checkboxes:");
    console.log(d3Selection.nodes());
    d3Selection.on("click", function(){
        // this = the DOM element itself such as <input>.
        // this allows access to its attributes, such as
        // this.checked for example
        // d3.select(this) converts DOM element to a d3.selection,
        // allowing access to d3 helper functions.
        console.log("inside eventhandler");
        console.log(d3.select(this));
        console.log(this.checked);
    });
}

function click() {
    console.log("inside click");
    console.log(d3.select(this));
    console.log(this);
}