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

}