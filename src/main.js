import {cartogramMap} from "./cartogram-map.js";
import {pointToPointChart} from "./point-to-point-chart.js";

/**
 * a main function to rule them all: acts as an overarcing check list.
 * @param data
 */
export function main(data, dataGroupedByYear){
    console.log("------entering main------");
    console.log("rawData:");
    console.log(data);
    cartogramMap(data);
    pointToPointChart(data);
}