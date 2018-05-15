import {cartogramMap} from "./cartogram-map.js";
import {pointToPointChart} from "./point-to-point-chart.js";
//import {InitSwissMap} from "./swiss_map.1.0.js";

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
    //InitSwissMap();
    cartogramMap(data);
    pointToPointChart(data);
}