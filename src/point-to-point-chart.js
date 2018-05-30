import {cantonsPM} from "./swiss_map.1.0.js";
import {religionsPM} from "./religion_selectors.js";
import {yearsPM} from "./years_selector.js";

import {initMapWithAllCantonsSelected} from "./swiss_map.1.0.js";


let allData;
let allDataGroupedByYear;

let cantonsToShow;
let religionsToShow;
let yearsToShow;
let selectedDataOnly;

let svg;
let g;
let points;
let margin;
let width;
let height;

let yScale;
let xScale;

const isoMapping = {
    AR: "Aargau",
    BE: "Bern",
    BL: "Basel-Landschaft",
    BS: "Basel-Stadt",
    FR: "Freiburg",
    GE: "Genf",
    GL: "Glarus",
    GR: "Graubünden",
    JU: "Jura",
    LU: "Luzern",
    NE: "Neuenburg",
    NW: "Nidwalden",
    OW: "Obwalden",
    SG: "St. Gallen",
    SH: "Schaffhausen",
    SO: "Solothurn",
    SZ: "Schwyz",
    TG: "Thurgau",
    TI: "Tessin",
    UR: "Uri",
    VD: "Waadt",
    VS: "Wallis",
    ZG: "Zug",
    ZH: "Zürich"
};

export function setupPointToPointChart(data, dataGroupedByYear) {
    allData = data;
    allDataGroupedByYear = dataGroupedByYear;

    // create svg canvas
    const canvHeight = 450, canvWidth = 660;
    svg = d3.select("div#line-graph").append("svg")
        .attr("width", canvWidth)
        .attr("height", canvHeight)
        //.style("border", "1px solid");

    // calc the width and height depending on margins.
    margin = {top: 50, right: 80, bottom: 50, left: 60};
    width = canvWidth - margin.left - margin.right - 60;
    height = canvHeight - margin.top - margin.bottom;

    // create parent group and add left and top margin
    g = svg.append("g")
        .attr("id", "point-to-point-chart")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // initial data
    let allCantons = [];
    allDataGroupedByYear[0].kantone.forEach(canton => allCantons.push({name: canton.kanton, iso: "ZH", isSelected: 'false'}));
    allCantons[4].isSelected = true;
    allCantons[24].isSelected = true;
    allCantons[22].isSelected = true;


    const allReligions = [
        {name: 'andere_christen', isSelected: false},
        {name: 'andere_religionen', isSelected: false},
        {name: 'muslime', isSelected: false},
        {name: 'juden', isSelected: false},
        {name: 'katholiken', isSelected: false},
        {name: 'konfessionslose', isSelected: false},
        {name: 'reformierte', isSelected: false}
    ];

    const allYears = [
        {year: 2011, isSelected: true},
        {year: 2012, isSelected: true},
        {year: 2013, isSelected: true},
        {year: 2014, isSelected: true},
        {year: 2015, isSelected: true},
        {year: 2016, isSelected: true}
    ];



    cantonsToShow = getCantonsToShow(allCantons);
    religionsToShow = getReligionsToShow(allReligions);
    yearsToShow = getYearsToShow(allYears);
    selectedDataOnly = getSelectedDataOnly();


    // create scales for x and y direction
    yScale = updateYScale();
    xScale = updateXScale();


    // create xAxis
    updateXAxis();

    // create yAxis
    updateYAxis();


    createXLabel();
    createYLabel();

    points = g.append("g").attr("class", "points");
}

export function updateCantons() {
    if (initMapWithAllCantonsSelected) console.log("update Cantons");

    cantonsToShow = getCantonsToShow(cantonsPM);
    selectedDataOnly = getSelectedDataOnly();

    console.log(cantonsToShow);
    console.log(selectedDataOnly);
    console.log("cantonsPM:");
    console.log(cantonsPM);

    // create scales for x and y direction
    yScale = updateYScale();

    // create yAxis
    updateYAxis();

    // add circle
    updatePoints();
}

export function updateReligions() {
    religionsToShow = getReligionsToShow(religionsPM);

    // add circle
    updatePoints();

    if (initMapWithAllCantonsSelected) console.log("update Religions");
}

export function updateYears() {
    yearsToShow = getYearsToShow(yearsPM);
    selectedDataOnly = getSelectedDataOnly();

    // create scales for x and y direction
    xScale = updateXScale();

    // create yAxis
    updateXAxis();

    // add circle
    updatePoints();

    if (initMapWithAllCantonsSelected) console.log("update Years");
}

function getCantonsToShow(cantonsPM) {
    return cantonsPM.filter(canton => canton.isSelected === true).map(canton => isoMapping[canton.iso]);
}

function getReligionsToShow(religionsPM) {
    return religionsPM.filter(religion => religion.isSelected === true && religion.name !== 'alle_religionen').map(religion => religion.name);
}

function getYearsToShow(yearsPM) {
    return yearsPM.filter(year => year.isSelected === true).map(year => year.year);
}

function getSelectedDataOnly() {
    return allData.filter(element => cantonsToShow.includes(element.kanton) && yearsToShow.includes(element.jahr));
}

function updateYScale() {
    // create scale for y direction
    return d3.scaleLinear()
        .range([height, 0])
        .domain([0, 100]);
}

function updateXScale() {
    // create domain for year axis
    const yearMax = d3.max(yearsToShow);
    const yearMin = d3.min(yearsToShow);
    const yearDomain = [yearMin, yearMax];

    // create scale for y direction
    return d3.scaleLinear()
        .range([0, width])
        .domain(yearDomain);
}

function createYLabel() {
    // text label for the y axis
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "middle")
        .text("Prozent");
}

function createXLabel() {
    // text label for the x axis
    g.append("text")
        .attr("y", height + margin.bottom / 2)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "middle")
        .text("Jahr");
}

function updateXAxis() {
    g.select("#axis-x").remove();
    // create xAxis
    const xAxis = d3.axisBottom(xScale)
        .tickValues(yearsToShow)
        .tickFormat(d3.format('.0f'));
    g.append("g")  // create a group and add axis
        .attr("id", "axis-x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
}

function updateYAxis() {
    g.select("#axis-y").remove();
    // create yAxis
    const yAxis = d3.axisLeft(yScale);
    g.append("g")  // create a group and add axis
        .attr("id", "axis-y")
        .call(yAxis);
}

function updatePoints() {
    points.selectAll("*").remove();

    if (selectedDataOnly.length !== 0) {

        // add circle
        religionsToShow.forEach(religion => {
            const religionGroup = points.append("g").attr("class", `religion religion__${religion}`);
            const lineGroup = religionGroup.append("g").attr("class", `line-group line-group__${religion}`);


            let counter = 0;
            let coordinatesFromPreviousCircle = {cx: 0, cy: 0};

            yearsToShow.forEach(year => {
                const filteredData = selectedDataOnly.filter(element => element.jahr === year);
                let religionCount = 0;
                filteredData.forEach(element =>
                    religionCount += element[religion]
                );

                let religionCountAll = 0;
                filteredData.forEach(element => {
                        religionCountAll += element.andere_christen;
                        religionCountAll += element.andere_religionen;
                        religionCountAll += element.muslime;
                        religionCountAll += element.juden;
                        religionCountAll += element.katholiken;
                        religionCountAll += element.konfessionslose;
                        religionCountAll += element.reformierte;
                    }
                );

                const religionPercentage = religionCount*100/religionCountAll;

                let coordinatesFromCurrentCircle = {cx: xScale(year), cy: yScale(religionPercentage)};

                const pointGroup = religionGroup.append("g").attr("class", `point-group point-group__${religion}-${year}`);

                pointGroup.append("circle")
                    .attr("class", `point point__${religion}-${year}`)
                    .attr("cx", coordinatesFromCurrentCircle.cx)
                    .attr("cy", coordinatesFromCurrentCircle.cy)
                    .attr("r", 4);

                // Connect points with lines
                if (counter > 0) {
                    lineGroup.append("line")
                        .attr("class", `line line__${religion}`)
                        .attr("x1", coordinatesFromPreviousCircle.cx)
                        .attr("y1", coordinatesFromPreviousCircle.cy)
                        .attr("x2", coordinatesFromCurrentCircle.cx)
                        .attr("y2", coordinatesFromCurrentCircle.cy);
                }

                coordinatesFromPreviousCircle.cx = coordinatesFromCurrentCircle.cx;
                coordinatesFromPreviousCircle.cy = coordinatesFromCurrentCircle.cy;

                ++counter;

                // Create label for every point
                const pointLabelGroup = pointGroup.append("g")
                    .attr("class", `point-label point-label__${religion}`);

                pointLabelGroup.append("polygon")
                    .attr("class", `polygon polygon__${religion}-${year}`)
                    .attr("points",
                        `${coordinatesFromCurrentCircle.cx},${coordinatesFromCurrentCircle.cy-2} 
                            ${coordinatesFromCurrentCircle.cx+6},${coordinatesFromCurrentCircle.cy-16} 
                            ${coordinatesFromCurrentCircle.cx-6},${coordinatesFromCurrentCircle.cy-16}`
                    );

                const pointLabelRectangle = pointLabelGroup.append("rect")
                    .attr("class", `rectangle rectangle__${religion}-${year}`)
                    .attr("id", `rectangle__${religion}-${year}`)
                    .attr("rx", "5")
                    .attr("ry", "5");

                const pointLabelTextPercentage = pointLabelGroup.append("text")
                    .attr("class", `text text__percentage-${religion}-${year}`)
                    .attr("id", `text__percentage-${religion}-${year}`)
                    .text(`${religionPercentage.toFixed(1)}%`);

                const pointLabelTextAmount = pointLabelGroup.append("text")
                    .attr("class", `text text__amount${religion}-${year}`)
                    .attr("id", `text__amount-${religion}-${year}`)
                    .text(`${religionCount} Personen`);

                const pointLabelTextPercentageElement = document.getElementById(`text__percentage-${religion}-${year}`);
                const pointLabelTextPercentageSVG = pointLabelTextPercentageElement.getBBox();

                const pointLabelTextAmountElement = document.getElementById(`text__amount-${religion}-${year}`);
                const pointLabelTextAmountSVG = pointLabelTextAmountElement.getBBox();

                pointLabelRectangle.attr("x", coordinatesFromCurrentCircle.cx-(pointLabelTextAmountSVG.width/2)-4)
                    .attr("y", coordinatesFromCurrentCircle.cy-16-pointLabelTextPercentageSVG.height-pointLabelTextAmountSVG.height-8-4)
                    .attr("width", pointLabelTextAmountSVG.width+8)
                    .attr("height", pointLabelTextPercentageSVG.height+pointLabelTextAmountSVG.height+8+4);

                const pointLabelRectangleElement = document.getElementById(`rectangle__${religion}-${year}`);
                const pointLabelRectangleSVG = pointLabelRectangleElement.getBBox();

                pointLabelTextPercentage.attr("x", pointLabelRectangleSVG.x+(pointLabelRectangleSVG.width/2))
                    .attr("y", coordinatesFromCurrentCircle.cy-16-pointLabelRectangleSVG.height+14);

                pointLabelTextAmount.attr("x", pointLabelRectangleSVG.x+(pointLabelRectangleSVG.width/2))
                    .attr("y", coordinatesFromCurrentCircle.cy-16-8);


                // Create label for every religion line
                if (year === d3.max(yearsToShow)) {
                    const coordinatesFromLastCircle = {cx: xScale(year), cy: yScale(religionCount*100/religionCountAll)};

                    const lineLabelGroup = lineGroup.append("g")
                        .attr("class", `line-label line-label__${religion}`);

                    lineLabelGroup.append("polygon")
                        .attr("class", `polygon polygon__${religion}`)
                        .attr("points",
                            `${coordinatesFromLastCircle.cx+2},${coordinatesFromLastCircle.cy} 
                            ${coordinatesFromLastCircle.cx+16},${coordinatesFromLastCircle.cy+6} 
                            ${coordinatesFromLastCircle.cx+16},${coordinatesFromLastCircle.cy-6}`
                        );

                    const labelRectangle = lineLabelGroup.append("rect")
                        .attr("class", `rectangle rectangle__${religion}`)
                        .attr("id", `rectangle__${religion}`)
                        .attr("x", coordinatesFromLastCircle.cx+16)
                        .attr("y", coordinatesFromLastCircle.cy-6)
                        .attr("height", 12);

                    const labelText = lineLabelGroup.append("text")
                        .attr("class", `text text__${religion}`)
                        .attr("id", `text__${religion}`)
                        .text(religion);

                    const labelTextElement = document.getElementById(`text__${religion}`);
                    const labelTextSVG = labelTextElement.getBBox();

                    labelRectangle.attr("width", labelTextSVG.width+8);

                    const labelRectangleElement = document.getElementById(`rectangle__${religion}`);
                    const labelRectangleSVG = labelRectangleElement.getBBox();

                    labelText.attr("x", labelRectangleSVG.x+(labelRectangleSVG.width/2))
                        .attr("y", coordinatesFromLastCircle.cy+4);
                }
            });
        });
    }

}