import {createHtmlInputElementOfType} from "./helper_lib.js";

/**
 * deals with form#religions checkboxes
 */

export const religionsPM = [
    //all religions
    { name: "alle_religionen",  id: "_alle_religionen", labeltext: "Alle Religionen",   parentid: "all-religions",    isSelected: false },
    //Christianity
    { name: "alle_christen",    id: "_alle_christen",   labeltext: "Alle Christen",     parentid: "christian-religions",    isSelected: false },
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
    //get parent elements
    const form = d3.select('form#religions');
    const christianReligions    = d3.select('section#christian-religions');
    const otherReligions        = d3.select('section#other-religions');

    console.log("setUpReligionsSelectors:");
    console.log(christianReligions.attr("id"));

    //create input elements while appending them to correct parent
    religionsPM.forEach( religion => {
        createHtmlInputElementOfType("checkbox", religion.name, religion.id, religion.id, religion.labeltext, religion.parentid, true);
    });

}