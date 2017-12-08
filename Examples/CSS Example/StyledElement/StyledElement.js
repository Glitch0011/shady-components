import ShadyElement from "/shady.js"

export class StyledElement extends ShadyElement {

}

ShadyElement.Register(StyledElement, { css: true });