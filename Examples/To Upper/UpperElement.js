import ShadyElement from "/shady.js"

export class UpperElement extends ShadyElement {
    get Upper() {
        return this.Data.Text.toUpperCase();
    }
}

ShadyElement.Register(UpperElement);
