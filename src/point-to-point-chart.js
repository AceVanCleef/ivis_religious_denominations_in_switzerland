import {cantonsPM} from "./swiss_map.1.0.js";
import {religionsPM} from "./religion_selectors.js";
import {yearsPM} from "./years_selector.js";

let allData;
let allDataGroupedByYear;

let cantonsToShow;
let religionsToShow;
let yearsToShow;
let selectedDataOnly;
// let peopleInSelectedCantonsAndYears;

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
    const canvHeight = 600, canvWidth = 800;
    svg = d3.select("body").append("svg")
        .attr("width", canvWidth)
        .attr("height", canvHeight)
        .style("border", "1px solid");

    // calc the width and height depending on margins.
    margin = {top: 50, right: 80, bottom: 50, left: 60};
    width = canvWidth - margin.left - margin.right;
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
        {name: 'islamisten', isSelected: false},
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
    cantonsToShow = getCantonsToShow(cantonsPM);
    selectedDataOnly = getSelectedDataOnly();
    // getPeopleInSelectedCantonsAndYears();

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
}

export function updateYears() {
    yearsToShow = getYearsToShow(yearsPM);
    selectedDataOnly = getSelectedDataOnly();
    // getPeopleInSelectedCantonsAndYears();

    // create scales for x and y direction
    xScale = updateXScale();

    // create yAxis
    updateXAxis();

    // add circle
    updatePoints();


}

function getCantonsToShow(cantonsPM) {
    return cantonsPM.filter(canton => canton.isSelected === true).map(canton => isoMapping[canton.iso]);
}

function getReligionsToShow(religionsPM) {
    console.log(religionsPM);
    return religionsPM.filter(religion => religion.isSelected === true && religion.name !== 'alle_religionen').map(religion => religion.name);
}

function getYearsToShow(yearsPM) {
    return yearsPM.filter(year => year.isSelected === true).map(year => year.year);
}

function getSelectedDataOnly() {
    return allData.filter(element => cantonsToShow.includes(element.kanton) && yearsToShow.includes(element.jahr));
}

// function getPeopleInSelectedCantonsAndYears() {
//     peopleInSelectedCantonsAndYears = 0;
//
//     selectedDataOnly.forEach(element => {
//             peopleInSelectedCantonsAndYears += element.andere_christen;
//             peopleInSelectedCantonsAndYears += element.andere_religionen;
//             peopleInSelectedCantonsAndYears += element.islamisten;
//             peopleInSelectedCantonsAndYears += element.juden;
//             peopleInSelectedCantonsAndYears += element.katholiken;
//             peopleInSelectedCantonsAndYears += element.konfessionslose;
//             peopleInSelectedCantonsAndYears += element.reformierte;
//     })
// }

function updateYScale() {
    // let allSupporters = [];
    // // create domain for supporter axis
    // yearsToShow.forEach(year => {
    //     let allOtherChristians = 0;
    //     let allOtherReligions = 0;
    //     let allIslamists = 0;
    //     let allJews = 0;
    //     let allCatholics = 0;
    //     let allConfessionless = 0;
    //     let allReformed = 0;
    //     selectedDataOnly
    //         .filter(element => element.jahr === year)
    //         .forEach(element => {
    //         allOtherChristians += element.andere_christen;
    //         allOtherReligions += element.andere_religionen;
    //         allIslamists += element.islamisten;
    //         allJews += element.juden;
    //         allCatholics += element.katholiken;
    //         allConfessionless += element.konfessionslose;
    //         allReformed += element.reformierte;
    //     });
    //     allSupporters.push(allOtherChristians);
    //     allSupporters.push(allOtherReligions);
    //     allSupporters.push(allIslamists);
    //     allSupporters.push(allJews);
    //     allSupporters.push(allCatholics);
    //     allSupporters.push(allConfessionless);
    //     allSupporters.push(allReformed);
    // });
    // const supporterMax = d3.max(allSupporters);
    const supporterDomain = [0, 100];

    // create scale for y direction
    return d3.scaleLinear()
        .range([height, 0])
        .domain(supporterDomain);
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
        .text("Anzahl Personen");
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


    // add circle
    religionsToShow.forEach(religion => {
        let religionGroup = points.append("g").attr("class", `points__${religion}`);

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
                religionCountAll += element.islamisten;
                religionCountAll += element.juden;
                religionCountAll += element.katholiken;
                religionCountAll += element.konfessionslose;
                religionCountAll += element.reformierte;
            }
            );

            let yearGroup = religionGroup.append("g").attr("class", `points__${year}`);

            yearGroup.append("circle")
                .attr("class", `point__${religion}-${year}`)
                .attr("cx", xScale(year))
                .attr("cy", yScale(religionCount*100/religionCountAll))
                .attr("r", 4);

            if (counter > 0) {
                religionGroup.append("line")
                    .attr("class", `line__${religion}-${year}`)
                    .attr("x1", coordinatesFromPreviousCircle.cx)
                    .attr("y1", coordinatesFromPreviousCircle.cy)
                    .attr("x2", xScale(year))
                    .attr("y2",yScale(religionCount*100/religionCountAll))
                    .attr("stroke", "red");
            }

            coordinatesFromPreviousCircle.cx = xScale(year);
            coordinatesFromPreviousCircle.cy = yScale(religionCount*100/religionCountAll);

            ++counter;
        });
    });
}