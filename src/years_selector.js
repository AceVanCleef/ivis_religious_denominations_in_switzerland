/**
 * Created by degonas on 18.05.2018.
 */

export function setupYearsSelector() {
    var slider = document.getElementById('years-slider');
    console.log(slider);

    noUiSlider.create(slider, {
        start: [20, 80],
        connect: true,
        range: {
            'min': 0,
            'max': 100
        }
    });
}