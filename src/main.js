import {setupPointToPointChart} from "./point-to-point-chart.js";
import {initSwissMap} from "./swiss_map.1.0.js";
import {setupRegionSelectors} from "./region_selectors.js";
import {setupReligionSelectors} from "./religion_selectors.js";
import {setupYearsSelector} from "./years_selector.js";



/**
 * a main function to rule them all: acts as an overarcing check list.
 * @param data
 */
export function main(data, dataGroupedByYear){
    console.log("------entering main------");
    console.log("rawData:");
    console.log(data);
    console.log("grouped data in main:");
    console.log(dataGroupedByYear);
    setupPointToPointChart(data, dataGroupedByYear);
    // Data first
    initSwissMap();
    setupRegionSelectors();
    setupReligionSelectors();
    setupYearsSelector( getAllYearsFrom(dataGroupedByYear) );
    // graph second
    //setupPointToPointChart(data, dataGroupedByYear);
}


//------------------------ Helper functions -------------------------

/*
function getCantonNamesFrom(dataGroupedByYear) {
    console.log("getCantonNamesFrom");
    var cantonNames = dataGroupedByYear[0].kantone.map(function(e){
        return e.kanton;
    });
    console.log((cantonNames));
    return cantonNames;
}

function getISOsFrom(dataGroupedByYear) {
    console.log("getISOsFrom");
    var cantonISOs = dataGroupedByYear[0].kantone.map(function(e){
        return e.iso;
    });
    console.log((cantonISOs));
    return cantonISOs;
}
    */

function getAllYearsFrom(dataGroupedByYear) {
    var years = dataGroupedByYear.map(e => e.year);
    return years.sort(function(a, b){return a - b});
}