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
    groupDataByYear(data);
    main(data, data);
});

function groupDataByYear(data){
    console.log("groupDataByYear");
    console.log(data[0]);
    console.log(data[0].jahr);
}