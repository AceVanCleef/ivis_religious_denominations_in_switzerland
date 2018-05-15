import {pointToPointChart} from "./point-to-point-chart.js";
import {initSwissMap} from "./swiss_map.1.0.js";



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
    initSwissMap();
    pointToPointChart(data);
}


//------------------------ Helper functions -------------------------


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