
__Für Deutsch, siehe weiter unten.__

# Religious Denominations in Switzerland - (ivis) 

We examine how the denomination of the Swiss population changed over 
the years from 2010 to 2016 on national and regional levels, while taking 
the growth of the population into consideration. 
The visualized data allows you to find out where the most Christians, 
undenominational people and people of other beliefs are living as well as 
how each denomination group evolved over time.


## Live Demo

To try out our application, you can visit it [here](https://acevancleef.github.io/ivis_religious_denominations_in_switzerland/).


## Getting Started

To continue developing this application, you can download its source code as a .zip file or create a forked repository. After installing your IDE of choice and a local http-server such as [npm http-server](https://www.npmjs.com/package/http-server) you are good to go.

### Prerequisites

Simple web server. Technologies: See "Used Technologies".

## Software Architektur

In this homework assignment, it is the first time my team and I experimented with [ECMAScript 6 Modules](http://2ality.com/2014/09/es6-modules-final.html).
Since we are used to the encapsulation paradigm of object oriented programming we decided to use modules in a similar fashion to classes in Java. Therefore, the code has been distributed to separate .js - files and external access to functions has only been granted to those intended.

* **load-data.js** - Extracts the data stored in religions.csv, groups it by years before sending the processed data to main.js.
* **main.js** - Contains the main() - function which calls all other setup and initialisation functions of other .js - files.
* **point-to-point-chart.js** - Draws the graph.
* **swiss_map.1.0.js** - Draws the map of Switzerland and sets up the selection of cantons.
* **region_selectors.js** - Sets up checkboxes for selecting regions and updates the map and graph upon user input.
* **religion_selectors.js** - Sets up checkboxes for selecting denominations.
* Years_selector.js - Initially intended to provide the end user the choide of which years he wants to display. However, during usability tests we realised that this feature didn't offer any significant benefit.
* **helper_lib.js** - a small collection of hand crafted helper functions.
* **info-box.js** - Initializes the logic of the info-box in &lt;aside id='right-sticky'&gt;.


swiss_map.1.0.js, region_selectors.js and religion_selectors.js are set up to inform the point-to-point-chart.js about user inputs via predefined update - functions.


### Difficulties, Challenges

Initially, it was intended to call update functions within the setup / initialisation function of a .js - file. Due to the asynchronous nature of [ECMAScript 6 Modules](http://2ality.com/2014/09/es6-modules-final.html) this wasn't possible.

Example: In swiss_map.1.0.js, the updateCantons() - function had to called at the end of drawBy() instead of initSwissMap().

Since it was our first time working with D3.js, it took us some time to get familiar with it. D3 uses its own selection - objects which offer their own methods for iteration, DOM - element selection, CSS - styling and more.

## Deployment

In order to deploy this application, simply download the complete source code and put it onto your own web server.

## Used Technologies

* [D3 version 4](https://www.npmjs.com/package/d3v4) - JavaScript data visualization framework.
* [TopoJson](https://github.com/topojson/topojson) - Used to draw maps.

#### Implemented, yet no longer used Technologies:
* [noUiSlider](https://refreshless.com/nouislider/) - compact, flexible slider plugin.
* [wNumb](https://refreshless.com/wnumb/) - number value formatting library. Dependency of noUiSlider.

Todo: noUiSlider and wNumb can be removed.


## Workshop
During the lecture of Tuesday, 29. May 2018 this application has been tested by fellow students. Their feedback included:
* Capitalization of religion names is inconsistent.
* Allocating a different color to each line might help to read the graph more easily.
* Following the x-Axis of the graph, only slight changes are noticeable.
* Selecting which years to display doesn't offer any benefit.
* Some lines of the graph align closeby each other. Being able to zoom it might help in reading the graph more easily.

Due to time constraints, the following changes have been made.
* Capitalization has been corrected.
* Each denomination is now represented in its own color.
* Year selector has been removed.


## Authors

* **Mario Winiker** - *Programming & Design* - [Figumari](https://github.com/Figumari)
* **Stefan Wohlgensinger** - *Programming & Design* - [AceVanCleef](https://github.com/AceVanCleef)


## Anerkennung

* Our fellow students who tested our application and gave us their feedback.
* Our fellow students who helped us with tips and hints regarding D3.
* Our lecturer for answering our questions regarding D3.


_06. April 2019: Translated README.md to English_

---


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
* [noUiSlider](https://refreshless.com/nouislider/) - kompaktes, flexibles Sliderplugin.
* [wNumb](https://refreshless.com/wnumb/) - Zahlenformatierungslibrary. Dependency von noUiSlider.

Todo: Die aufgelisteten Technologien können entfernt werden.

## Workshop
Auf Grund des Workshops vom Dienstag, 29. Mai 2018 konnten wir einige Verbesserungsvorschläge von unserern Mitstudierenden in Erfahrung bringen.
* Gross-/Kleinschreibung der Religionen ist nicht konstant
* Unterschiedliche Farben der Linien können hilfreich sein, die Religionen in der Grafik auseinanderzuhalten.
* Da nur geringfügige Veränderungen über die Zeit sichtbar sind, wurde uns empfohlen, die Grafik nochmals zu überdenken
* Die Auswahl der anzuzeigenden Jahre sei witzlos und überflüssig
* Oft werden die 100% in der Grafik nicht voll ausgenutzt. Hier könnte man auf das aktuelle Maximum aufzoomen. Damit würden auch die kleineren Werte in der Grafik besser sichtbar.

Da nur noch begrenzt Zeit zur Verfügung stand, konnten wir nicht mehr alle Vorschläge übernehmen bzw. umsetzen.
* Gross-/Kleinschreibung ist korrigiert
* Die Religionen werden mit Farben auseinadergehalten
* Der Jahresselektor wurde entfernt

## Authoren

* **Mario Winiker** - *Programmierung & Design* - [Figumari](https://github.com/Figumari)
* **Stefan Wohlgensinger** - *Programmierung & Design* - [AceVanCleef](https://github.com/AceVanCleef)


## Anerkennung

* Unsere Mitstudenten, welche uns Feedback gaben oder bei Problemen mit D3 Tipps gaben.
* Unseren Dozenten für das Beantworten von Fragen zu D3.
