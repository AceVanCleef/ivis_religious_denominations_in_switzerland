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
