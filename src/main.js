import {loadReligionData, printtest} from "/src/load_data.js";



const main = function() {
	console.log("hello");
	printtest();
	const rawReligionData = loadReligionData();
	console.log(rawReligionData);
}

main();