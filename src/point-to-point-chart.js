import {cantonsPM as hound} from "./swiss_map.1.0.js";
import {religionsPM as cat} from "./religion_selectors.js";


function pointToPointChart(data, dataGroupedByYear) {
    // just template data
    let allCantons = [];
    dataGroupedByYear[0].kantone.forEach(canton => allCantons.push({name: canton.kanton, iso: 'hb', isSelected: 'false'}));
    allCantons[4].isSelected = true;
    allCantons[24].isSelected = true;
    allCantons[22].isSelected = true;

    console.log("hani");
    console.log(cat);

    const allReligions = [
        {name: 'andere_christen', isSelected: false},
        {name: 'andere_religionen', isSelected: true},
        {name: 'islamisten', isSelected: true},
        {name: 'juden', isSelected: false},
        {name: 'katholiken', isSelected: false},
        {name: 'konfessionslose', isSelected: true},
        {name: 'reformierte', isSelected: false}
    ];

    const allYears = [
        {name: 2011, isSelected: true},
        {name: 2012, isSelected: true},
        {name: 2013, isSelected: true},
        {name: 2014, isSelected: true},
        {name: 2015, isSelected: true},
        {name: 2016, isSelected: true}
    ];




    // create svg canvas
    const canvHeight = 600, canvWidth = 800;
    const svg = d3.select("body").append("svg")
        .attr("width", canvWidth)
        .attr("height", canvHeight)
        .style("border", "1px solid");

    // calc the width and height depending on margins.
    const margin = {top: 50, right: 80, bottom: 50, left: 60};
    const width = canvWidth - margin.left - margin.right;
    const height = canvHeight - margin.top - margin.bottom;

    // create parent group and add left and top margin
    const g = svg.append("g")
        .attr("id", "point-to-point-chart")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create domain for supporter axis
    let allSupporters = [];
    data.forEach(element => {
        if (cantonsToShow.includes(element.kanton)) {
            allSupporters.push(element.andere_christen);
            allSupporters.push(element.andere_religionen);
            allSupporters.push(element.islamisten);
            allSupporters.push(element.juden);
            allSupporters.push(element.katholiken);
            allSupporters.push(element.konfessionslose);
            allSupporters.push(element.reformierte);
        }
    });
    const countMax = d3.max(allSupporters);
    const countDomain = [0, countMax];

    // create domain for year axis
    const yearMax = d3.max(yearsToShow);
    const yearMin = d3.min(yearsToShow);
    const yearDomain = [yearMin, yearMax];

    // create scales for x and y direction
    const xScale = d3.scaleLinear()
        .range([0, width])
        .domain(yearDomain);

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain(countDomain);

    // create xAxis
    const xAxis = d3.axisBottom(xScale)
        .tickValues(yearsToShow)
        .tickFormat(d3.format('.0f'));
    g.append("g")  // create a group and add axis
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // create yAxis
    const yAxis = d3.axisLeft(yScale);
    g.append("g")  // create a group and add axis
        .call(yAxis);


    // filter data
    // const filteredData = data.forEach(element => {
    //     if (cantonsPM.includes(element.kanton)) {
    //         return element;
    //     }
    // });



    // add circle
    religionsToShow.forEach(religion => {
        let religionGroup = g.append("g").attr("class", `points__${religion}`);

        let counter = 0;
        let cordinatesFromPreviousCircle = {cx: 0, cy: 0};

        yearsToShow.forEach(year => {
            const filteredData = selectedDataOnly.filter(element => element.jahr === year);
            let religionCount = 0;
            filteredData.forEach(element =>
                religionCount += element[religion]
            );

            let yearGroup = religionGroup.append("g").attr("class", `points__${year}`);

            yearGroup.append("circle")
                .attr("class", `point__${religion}-${year}`)
                .attr("cx", xScale(year))
                .attr("cy", yScale(religionCount))
                .attr("r", 4);

            if (counter > 0) {
                religionGroup.append("line")
                    .attr("class", `line__${religion}-${year}`)
                    .attr("x1", cordinatesFromPreviousCircle.cx)
                    .attr("y1", cordinatesFromPreviousCircle.cy)
                    .attr("x2", xScale(year))
                    .attr("y2",yScale(religionCount))
                    .attr("stroke", "red");
            }

            cordinatesFromPreviousCircle.cx = xScale(year);
            cordinatesFromPreviousCircle.cy = yScale(religionCount);

            ++counter;
        });
    });



    // text label for the y axis
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "middle")
        .text("Anzahl Personen");

    // text label for the x axis
    g.append("text")
        .attr("y", height + margin.bottom / 2)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "middle")
        .text("Jahr");
};

function one() {

}

function two() {

}

export {pointToPointChart};