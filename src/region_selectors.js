import {selectedCantons} from "./swiss_map.1.0.js";

/**
 * deals with form#swiss-regions checkboxes
 */

const regions = [
    { name: "Ostschweiz", code: "OCH", cantons: ["AI","AR","GL","GR","SG","SH","TG"]},
    {}
    //continue here
];

export function setupRegionSelectors() {
    //strategy:
    //1. prepare dictionaries like dict<region-code, iso[]>
    //2. get checkbox elements from DOM. Maybe as per <section> or not.
    //3. using d3's on(), register eventhandlers and define callback functions.

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

    d3.selectAll('#swiss-regions input')
        .on("click", click);
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