import {ShadyElement} from "/shady.js"

export class StyledElement extends ShadyElement {

}

ShadyElement.Register(StyledElement, {
    src: "/Examples/CSS Example/StyledElement/",
    css: true
});