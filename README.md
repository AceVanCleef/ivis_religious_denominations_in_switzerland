# Religionszugehörigkeit in der Schweiz - (ivis)

Wir untersuchen, wie sich die Konfessionszugehörigkeit der Schweizer 
Bevölkerung in den Jahren 2010 bis 2016 verändert hat, unter Berücksichtigung 
des Bevölkerungswachstums. Dies einerseits national als auch regional auf 
Kantonsebene. So lassen sich auch Aussagen machen, wo es am meisten Christen, 
Konfessoinslose und Menschen mit anderer Orientierungen gibt und welche 
Kategorie wann am meisten Zulauf erhielt.


## Live Demo

Um unsere Applikation in Aktion zu sehen, besuche [unsere Livedemo](https://acevancleef.github.io/ivis_religious_denominations_in_switzerland/).




## Getting Started

Um diese Applikation weiterzuentwickeln, lade es als .zip herunter oder erstelle ein Fork - Repository. Mit einer IDE deiner Wahl und einem lokalen http-server wie [npm http-server](https://www.npmjs.com/package/http-server) bist du bereits startklar. 

### Prerequisites

Einfacher Webserver. Technologien: Siehe "Verwendete Technologien".

## Software Architektur

In diesem studentischen Lern- und Modulprojekt experimentierten wir zum ersten Mal mit 
den [ECMAScript 6 Modulen](http://2ality.com/2014/09/es6-modules-final.html).
Da wir aus der Welt der objektorientierten Programmierung die Kapselung gewohnt sind und wir mit den Modulen 
die Sichtbarkeit in .js - Files steuern können, unterteilten wir unser Projekt in separate Files.

* **load-data.js** - Lädt die Daten aus religions.csv aus, gruppiert diese nach Jahren und übergibt diese an main.js.
* **main.js** - Enthält die in der Javawelt übliche main() - Funktion. Diese ruft alle weiteren Setup- und 
Initialisierungsmethoden anderer .js - Files auf.
* **point-to-point-chart.js** - Hier wird der Graf gezeichnet.
* **swiss_map.1.0.js** - Hier wird die Schweizer Karte gezeichnet und für die Kantonsauswahl vorbereitet.
* **region_selectors.js** - Hier werden die Checkboxen für die Regionsauswahl vorbereitet und mit der Schweizer Karte verlinkt.
* **religion_selectors.js** - Hier werden die Checkboxen für die Religionsauswahl vorbereitet.
* Years_selector.js - Anfänglich für die Jahresselektion angedacht. In Usabilitytests stellten wir fest, dass die Jahresauswahl wenig Sinn ergab.
* **helper_lib.js** - eine kleine Sammlung selbstgebastelter Hilfsfunktionen.
* **info-box.js** - Initialisiert die Logik für die info-box im &lt;aside id='right-sticky'&gt;.

swiss_map.1.0.js, region_selectors.js und religion_selectors.js wurden so eingerichtet, dass sie die point-to-point-chart.js via update - Funktionen aktualisieren.

### Schwierigkeiten, Herausforderungen
[ECMAScript 6 Module](http://2ality.com/2014/09/es6-modules-final.html) unterliegen einem asynchronen Aufrufprinzip. Dies führte dazu, dass die Updatemethoden anstelle in der Setup-/Initialisierungsmethode eines .js-Files aufzurufen, im Anschluss einer anderen verwendet werden mussten. 

Bsp: Die updateCantons() - Funktion musste in swiss_map.1.0.js am Ende der drawBy() - Funktion anstelle der initSwissMap() aufgerufen werden. 

Da wir zum ersten Mal mit dem D3 - Framework arbeiteten, benötigten wir eine gewisse Zeit, bis wir damit umgehen konnten. D3 arbeitet auf selection - Objekten, welche ihre eigenen Methoden für Iteration, DOM-Elementenauswahl, CSS-Styling usw. anbietet.

## Deployment

Um die Applikation in einer Liveumgebung zu intallieren, lade den Root Folder dieses Projektes auf deinen Webserver.

## Verwendete Technologien

* [D3 version 4](https://www.npmjs.com/package/d3v4) - JavaScript Datenvisualisierungsframework.
* [TopoJson](https://github.com/topojson/topojson) - Zur Erstellung von Karten.

#### Implementierte, jedoch nicht mehr zur Geltung kommende Technologien:
* [noUiSlider](https://refreshless.com/nouislider/) - kompatkes, flexibles Sliderplugin.
* [wNumb](https://refreshless.com/wnumb/) - Zahlenformatierungslibrary. Dependency von noUiSlider.

Todo: Die aufgelisteten Technologien können entfernt werden.

## Authoren

* **Mario Winiker** - *Programmierung & Design* - [Figumari](https://github.com/Figumari)
* **Stefan Wohlgensinger** - *Programmierung & Design* - [AceVanCleef](https://github.com/AceVanCleef)


## Anerkennung

* Unsere Mitstudenten, welche uns Feedback gaben oder bei Problemen mit D3 Tipps gaben.
* Unseren Dozenten für das Beantworten von Fragen zu D3.
