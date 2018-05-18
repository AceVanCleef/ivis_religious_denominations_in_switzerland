/**
 * using: https://refreshless.com/nouislider/
 * using: https://refreshless.com/wnumb/
 */

export const yearsPM = [];

export function setupYearsSelector( allYears ) {
    var slider = document.getElementById('years-slider');

    noUiSlider.create(slider, {
        start: [getFirstYearFrom(allYears), getLastYearFrom(allYears)],    //element count == amount of slider handles.
        connect: true,
        behaviour: 'drag-tap',
        step: 1,
        tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })], //wNumb({ decimals: 0 }) required
        range: {
            'min': getFirstYearFrom(allYears),
            'max': getLastYearFrom(allYears)
        },
        pips: {
            mode: 'steps',
            stepped: true,
            density: -1
        }
    });

    populateYearsPM(allYears);

    slider.noUiSlider.on("change", handleUserInput);

}

function handleUserInput( values, handle, unencoded, tap, positions ) {
    // values: Current slider values (array);
    // handle: Handle that caused the event (number);
    // unencoded: Slider values without formatting (array);
    // tap: Event was caused by the user tapping the slider (boolean);
    // positions: Left offset of the handles (array);
    // isSelected = true for all in intervall [unencoded[0], unencoded[1]] -> unencoded[0] <= y.year <= unencoded[1]
    yearsPM.forEach(y => {
       y.isSelected = (unencoded[0] <= y.year && y.year <= unencoded[1]);
    });

    //TODO: inform line graph.

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