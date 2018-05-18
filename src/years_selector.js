/**
 * using: https://refreshless.com/nouislider/
 * using: https://refreshless.com/wnumb/
 */

export const yearsPM = [];

export function setupYearsSelector( allYears ) {
    var slider = document.getElementById('years-slider');
    console.log("setupYearsSelector");
    console.log(slider);
    console.log(allYears);

    const firstYear = getFirstYearFrom(allYears);
    const lastYear = getLastYearFrom(allYears);
    console.log(firstYear);
    console.log(lastYear);

    noUiSlider.create(slider, {
        start: [getFirstYearFrom(allYears), getLastYearFrom(allYears)],    //element count == amount of slider handles.
        connect: true,
        behaviour: 'drag-tap',
        step: 1,
        tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })], //wNumb({ decimals: 0 }) required
        range: {
            'min': getFirstYearFrom(allYears),
            'max': getLastYearFrom(allYears)
        }
    });

    //testing slider movement
   // allYears.forEach(y =>     slider.noUiSlider.set([y, null]) );

    populateYearsPM(allYears);
    console.log("yearsPM:");
    console.log(yearsPM);

    //Todo: read slider values and update years.PM on change.
}

function populateYearsPM(allYears) {
    allYears.forEach(y => yearsPM.push( createYearPM(y) ));
}

function createYearPM(_year) {
    return {
        year: _year,
        isSelected: false
    }
}

function getFirstYearFrom(allYears) {
    return allYears.slice(0,1).shift();
}

function getLastYearFrom(allYears) {
    return allYears.slice(allYears.length - 1, allYears.length).pop();
}