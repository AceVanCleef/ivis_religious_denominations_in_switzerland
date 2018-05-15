function pointToPointChart(data, dataGroupedByYear) {
    // just template data
    let allCantons = [];
    dataGroupedByYear[0].kantone.forEach(canton => allCantons.push({name: canton.kanton, iso: 'hb', isSelected: 'false'}));
    allCantons[4].isSelected = true;
    allCantons[24].isSelected = true;
    console.log(allCantons.filter(element => element.isSelected === true));

    const indexB = 3;
    console.log(
        data[indexB].andere_christen +
        data[indexB].andere_religionen +
        data[indexB].islamisten +
        data[indexB].juden +
        data[indexB].katholiken +
        data[indexB].konfessionslose +
        data[indexB].reformierte
    );

    const allReligions = [
        {name: 'andere_christen', isSelected: 'false'},
        {name: 'andere_religionen', isSelected: 'false'},
        {name: 'islamisten', isSelected: 'true'},
        {name: 'juden', isSelected: 'false'},
        {name: 'katholiken', isSelected: 'false'},
        {name: 'konfessionslose', isSelected: 'true'},
        {name: 'reformierte', isSelected: 'false'}
    ];

    const selectedCantons = allCantons.filter(canton => canton.isSelected === true).map(canton => canton.name);
    const selectedReligions = allReligions.filter(religion => regligion.isSelected === true).map(religion => religion.name);


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
        .attr("id", "chart-area")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create domain for supporter axis
    let allSupporters = [];
    data.forEach(element => {
        if (selectedCantons.includes(element.kanton)) {
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
    const allYears = Array.from(new Set(data.map(d => d.jahr)));
    const yearMax = d3.max(allYears);
    const yearMin = d3.min(allYears);
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
        .tickValues(allYears)
        .tickFormat(d3.format('.0f'));
    g.append("g")  // create a group and add axis
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // create yAxis
    const yAxis = d3.axisLeft(yScale);
    g.append("g")  // create a group and add axis
        .call(yAxis);


    // filter data
    const filteredData = data.filter(element => {
        if (selectedCantons.includes(element.kanton)) {
            return {religion: element.religion}
        }
    });

    console.log(filteredData);

    // add circle
    let data_points = g.selectAll("circle")  // this is just an empty placeholder
        .data(filteredData)
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", d => xScale(d.jahr))
        .attr("cy", d => yScale(d.katholiken))
        .attr("r", 4);


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

export {pointToPointChart};