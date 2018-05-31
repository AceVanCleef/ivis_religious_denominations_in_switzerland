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
let pointLabel;
let lineLabel;

let margin;
let width;
let height;
const radius = 6;
const strokeWidth = 4;

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

const religionMapping = {
    andere_christen: "Andere Christen",
    andere_religionen: "Andere Religionen",
    muslime: "Muslime",
    juden: "Juden",
    katholiken: "Katholiken",
    konfessionslose: "Konfessionslose",
    reformierte: "Reformierte"
};



export function setupPointToPointChart(data, dataGroupedByYear) {
    allData = data;
    allDataGroupedByYear = dataGroupedByYear;

    // create svg canvas
    const canvHeight = 450, canvWidth = 660;
    svg = d3.select("div#line-graph").append("svg")
        .attr("width", canvWidth)
        .attr("height", canvHeight);

    // calculate the width and height depending on margins.
    margin = {top: 50, right: 80, bottom: 50, left: 60};
    width = canvWidth - margin.left - margin.right - 60;
    height = canvHeight - margin.top - margin.bottom;

    // create parent group and add left and top margin
    g = svg.append("g")
        .attr("id", "point-to-point-chart")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // initiate data
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

    // initiate labels
    pointLabel = d3.select("div#pointLabel");
    lineLabel = d3.select("div#lineLabel");
    const graphWrapper = d3.select('div#line-graph');
    graphWrapper.on("mousemove", d => {
        // mouse position
        let x = d3.event.pageX;
        let y = d3.event.pageY;

        // label position
        pointLabel.style('left', x + 20 + 'px')
            .style('top', y - 45 + 'px');

        lineLabel.style('left', x + 20 + 'px')
            .style('top', y - 25 + 'px');
    });
}

export function updateCantons() {
    if (initMapWithAllCantonsSelected) console.log("update Cantons");

    cantonsToShow = getCantonsToShow(cantonsPM);
    selectedDataOnly = getSelectedDataOnly();

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
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text("Prozentualer Anteil");
}

function createXLabel() {
    // text label for the x axis
    g.append("text")
        .attr("y", height + margin.bottom / 2)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .style("font-size", "16px")
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
    const yAxis = d3.axisLeft(yScale)
        .tickSize(8)
        .tickPadding(10);
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

                const point = pointGroup.append("circle")
                    .attr("class", `point point__${religion}-${year}`)
                    .attr("cx", coordinatesFromCurrentCircle.cx)
                    .attr("cy", coordinatesFromCurrentCircle.cy)
                    .attr("r", radius)
                    .on("mouseover", () => {
                        // Resize circles
                        point.attr("r", radius * 1.5);

                        // Create label for every point
                        pointLabel.style('display', 'inherit');
                        pointLabel.select("#pointLabel__percentage").html(`${religionPercentage.toFixed(1)}%`);
                        pointLabel.select("#pointLabel__headcount").html(`${religionCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")} Personen`);
                    })
                    .on("mouseout", () => {
                        // Resize point
                        point.attr("r", radius);

                        pointLabel.style('display', 'none');
                    });

                // Connect points with lines
                if (counter > 0) {
                    lineGroup.append("line")
                        .attr("class", `line line__${religion}`)
                        .attr("x1", coordinatesFromPreviousCircle.cx)
                        .attr("y1", coordinatesFromPreviousCircle.cy)
                        .attr("x2", coordinatesFromCurrentCircle.cx)
                        .attr("y2", coordinatesFromCurrentCircle.cy)
                        .attr("stroke-width", strokeWidth)
                        .on("mouseover", () => {
                            // Resize line
                            d3.selectAll(`.line__${religion}`).attr("stroke-width", strokeWidth*2);

                            // Label for the Lines
                            lineLabel.style('display', 'inherit');
                            lineLabel.select("#lineLabel__religion").html(religionMapping[religion]);
                        })
                        .on("mouseout", () => {
                            // Resize line
                            d3.selectAll(`.line__${religion}`).attr("stroke-width", strokeWidth);

                            lineLabel.style('display', 'none');
                        });
                }

                coordinatesFromPreviousCircle.cx = coordinatesFromCurrentCircle.cx;
                coordinatesFromPreviousCircle.cy = coordinatesFromCurrentCircle.cy;

                ++counter;
            });
        });
    }

}