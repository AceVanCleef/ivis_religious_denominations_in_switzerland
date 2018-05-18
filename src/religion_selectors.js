import {createHtmlInputElementOfType} from "./helper_lib.js";

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
    { name: "islamisten",           id: "_islamisten",              labeltext: "Islamisten",        parentid: "other-religions",   isSelected: false },
    { name: "andere_religionen",    id: "_andere_religionen",       labeltext: "Andere Religionen", parentid: "other-religions",   isSelected: false },
    // no denomination
    { name: "konfessionslose",  id: "_konfessionslose", labeltext: "konfessionslose",   parentid: "no-religion",    isSelected: false }
];

export function setupReligionSelectors() {

    console.log("setUpReligionsSelectors:");

    //create input elements while appending them to correct parent
    religionsPM.forEach( religion => {
        createHtmlInputElementOfType("checkbox", religion.name, religion.id, religion.id, religion.labeltext, religion.parentid, true);
    });

    //setup eventhandler
    var checkboxSelection = d3.selectAll('form#religions input');
    checkboxSelection.on("click", handleUserInput);
}

function handleUserInput() {
    //1. update religionsPM
    //2. inform line graph
    var checkbox = this;

    religionsPM.forEach(religion => {
        if (religion.id === checkbox.id) {
            religion.isSelected = checkbox.checked;
        }
    });

    //TODO: inform line graph.
}