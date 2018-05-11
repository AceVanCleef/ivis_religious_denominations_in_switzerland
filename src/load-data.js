import {main} from "./main.js";

d3.csv("/data/religions.csv", (d) => {
    return {
        kanton : d.kanton,
        jahr : +d.jahr,
        total : +d.total,
        reformierte : +d.reformierte,
        katholiken : +d.katholiken,
        andere_christen : +d.andere_christen,
        juden : +d.juden,
        islamisten : +d.islamisten,
        andere_religionen : +d.andere_religionen,
        konfessionslose : +d.konfessionslose
    };
}, (data) => {
    console.log(data);
    main(data, groupDataByYear(data));
});

function groupDataByYear(data){
    console.log("groupDataByYear");
    return groupByYears(data, extractYearsFrom(data));
}

function extractYearsFrom(data) {
    var allYears = [];
    data.forEach(function(e){
        if (!allYears.includes(e.jahr)) {
            allYears.push(e.jahr);
        }
    });
    console.log("allYears:");
    console.log(allYears);
    return allYears;
}

function groupByYears(data, years){
    var groupedData = [];
    years.forEach( function(y){
        var dataOfOneYear = data.filter(function(e){
            return e.jahr === y;
        });
        var totalOfOneYear = dataOfOneYear.shift();
        console.log("data of one year:");
        console.log(dataOfOneYear);
        // this is how an element will look like:
        groupedData.push({
            year: y,
            total: totalOfOneYear,
            kantone: dataOfOneYear
        })
    });
    console.log("grouped data:");
    console.log(groupedData);
    return groupedData;
}