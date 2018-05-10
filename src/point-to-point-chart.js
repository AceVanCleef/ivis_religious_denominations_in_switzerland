function pointToPointChart(data) {
	console.log(data[0].jahr);

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

    // create test text
    const g = svg.append("text")
        .attr("x", 400)
        .attr("y", 300)
        .text("Ich bin die Point-to-Point Grafik");
};

export {pointToPointChart};