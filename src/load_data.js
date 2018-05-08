export function printtest(){
	console.log("hi");
}

export function loadReligionData(){
	d3.csv("../data/religions.csv", function(error, d) {
		//accessor function: offers full control on how you return each item.
		console.log(d[0]);
	  return {
	  	//kanton;jahr;total;reformierte;katholiken;andere-christen;juden;islamisten;andere-religionen;konfessionslose
	    	kanton 				: d.kanton,
	    	jahr				: +d.jahr,
	    	total				: +d.total,
	    	reformierte			: +d.reformierte,
	    	katholiken			: +d.katholiken,
	    	andereChristen		: +d.andere-christen,
	    	juden				: +d.juden,
	    	islamisten			: +d.islamisten,
	    	andereReligionen	: +d.andere-religionen,
	    	konfessionslose		: +d.konfessionslose
	  };
	}, function(data) {
	  //call functions to process your data here.
		console.log("processed data:")
		console.log(data.jahr);
		console.log(data);
	    return data;
	});
}