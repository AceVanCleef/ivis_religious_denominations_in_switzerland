/**
 * Description:
 * provides functions commonly used written in native javascript.
 * This script doesn't guarantee support of all IE versions.
 *
 * Authors: Stefan Wohlgensinger, Mario Winiker.
 */

export function addCSSClass(id, className){
    document.getElementById(id).classList.add(className);
}

export function toggleCSSClass(id, className){
    document.getElementById(id).classList.toggle(className);
}

export function removeCSSClass(id, className){
    document.getElementById(id).classList.remove(className);
}

/**
 * appends an <input> of _type to _parentID with given attributes and _labeltext.
 * @param _type "checkbox" --> <input type="checkbox">
 * @param _name     --> <input name="...">
 * @param _value    --> <input value="...">
 * @param _id       --> <input id="...">
 * @param _labeltext the description of the input field.
 * @param _parentID "#myparent": to which the input element should be appended.
 * @param _withLineBreak boolean - if true, a <br /> element will be appended to _parentID.
 */
export function createHtmlInputElementOfType(_type, _name, _value, _id, _labeltext, _parentID, _withLineBreak = false) {
    //source: https://stackoverflow.com/questions/13330202/how-to-create-list-of-checkboxes-dynamically-with-javascript

    //TODO: check if flexible enough to create other input types.
    //TODO: check how to reduce amount of parameters.

    //native style
    var parent = document.getElementById(_parentID);

    //create DOM elements
    var label = document.createElement("label");
    var input = document.createElement("INPUT");
    var text  = document.createTextNode(_labeltext);

    // define input's attributes
    input.type = _type;
    input.name = _name;
    input.id = _id;
    input.value = _value;
    //package DOM elements
    label.appendChild(input);
    label.appendChild(text);

    //append to parent
    parent.appendChild(label);

    if (_withLineBreak){
        var br = document.createElement('br');
        parent.appendChild(br);
    }
}