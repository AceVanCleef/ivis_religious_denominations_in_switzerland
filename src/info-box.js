
export function setupInfoBox() {
    console.log("info box:");

    var infoBox = d3.select("section#info-box");

    // hovering over the map
    d3.select("div#map-wrapper")
        .on('mouseover', event => {
            infoBox.select("h3").html("Wähle...");
            infoBox.select("p").html("einen oder mehrere <span style='color: orangered;'>Kantone</span>.");
        })
        .on('mouseout', event => {
                infoBox.select("h3").html("");
            infoBox.select("p").html("");
        });

    // hovering over region selectors
    d3.select("form#swiss-regions")
        .on('mouseover', event => {
            infoBox.select("h3").html("Wähle...");
            infoBox.select("p").html("eine oder mehrere <span style='color: lime;'>Regionen</span>.");
        })
        .on('mouseout', event => {
                infoBox.select("h3").html("");
            infoBox.select("p").html("");
        });

    // hovering over religion selectors
    d3.select("form#religions")
        .on('mouseover', event => {
            infoBox.select("h3").html("Wähle...");
            infoBox.select("p").html("eine oder mehrere <span style='color: dodgerblue;'>Religionen</span>.");
        })
        .on('mouseout', event => {
                infoBox.select("h3").html("");
            infoBox.select("p").html("");
        });

    // hovering over line-graph
    d3.select("div#line-graph")
        .on('mouseover', event => {
            infoBox.select("h3").html("Betrachte...");
            infoBox.select("p").html("die Statistik: Die Daten der ausgewählten <span style='color: orangered;'>Kantone</span>/" +
                "<span style='color: lime;'>Regionen</span> werden pro <span style='color: dodgerblue;'>Religion</span> aufsummiert dargestellt.");
        })
        .on('mouseout', event => {
                infoBox.select("h3").html("");
            infoBox.select("p").html("");
        });
}