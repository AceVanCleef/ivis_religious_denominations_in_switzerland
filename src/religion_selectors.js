import {createHtmlInputElementOfType} from "./helper_lib.js";
import {updateReligions} from "./point-to-point-chart.js";

/**
 * deals with form#religions checkboxes
 */

export const religionsPM = [
    //all religions
    { name: "alle_religionen",  id: "_alle_religionen", labeltext: "Alle Religionen",   parentid: "all-religions",    isSelected: false },
    //Christianity
    { name: "katholiken",       id: "_katholiken",      labeltext: "katholiken",        parentid: "christian-religions",    isSelected: false },
    { name: "reformierte",      id: "_reformierte",     labeltext: "reformierte",       parentid: "christian-religions",    isSelected: false },
    { name: "andere_christen",  id: "_andere_christen", labeltext: "andere Christen",   parentid: "christian-religions",    isSelected: false },
    //Other religions
    { name: "juden",                id: "_juden",                   labeltext: "Juden",             parentid: "other-religions",   isSelected: false },
    { name: "muslime",              id: "_muslime",                 labeltext: "Muslime",           parentid: "other-religions",   isSelected: false },
    { name: "andere_religionen",    id: "_andere_religionen",       labeltext: "Andere Religionen", parentid: "other-religions",   isSelected: false },
    // no denomination
    { name: "konfessionslose",  id: "_konfessionslose", labeltext: "konfessionslose",   parentid: "no-religion",    isSelected: false }
];

//var checkboxSelection;
var allReligionsSelector;
var individualReligions;

export function setupReligionSelectors() {
    //create input elements while appending them to correct parent
    religionsPM.forEach( religion => {
        createHtmlInputElementOfType("checkbox", religion.name, religion.id, religion.id, religion.labeltext, religion.parentid, true);
    });

    //setup eventhandlers
    allReligionsSelector = d3.select('#_alle_religionen');
    allReligionsSelector.on("click", handleAllReligionsSelector);
    individualReligions = d3.selectAll('form#religions input').filter(function(){ return this.id !== '_alle_religionen';});
    individualReligions.on('click', handleIndividualReligions);
}

function handleIndividualReligions() {
    // update religionPM.
    var checkbox = this;
    var currentReligion = religionsPM.find(r => r.id === checkbox.id);
    currentReligion.isSelected = checkbox.checked;

    allReligionsSelector.property('checked', areAllReligionsSelected());
    religionsPM.find(r => r.id === '_alle_religionen').isSelected = areAllReligionsSelected();

    updateReligions();
}

function handleAllReligionsSelector() {
    console.log("handleAllReligionsSelector:");
    console.log(this);
    var checkbox = this;

    religionsPM.forEach(religion => {
       religion.isSelected = checkbox.checked;
       d3.select('#' + religion.id).property('checked', checkbox.checked);
    });

    updateReligions();
}

function areAllReligionsSelected() {
    //var bool = religionsPM.slice(1, religionsPM.length).every(r => r.isSelected=== true);
    return religionsPM.filter(r => r.id !== allReligionsSelector.attr('id')).every(r => r.isSelected=== true);
}