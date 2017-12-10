import ShadyElement from "/shady.js"

export class EmptyElement extends ShadyElement {
    connectedCallback() {
        super.connectedCallback();

        alert("Hello, World!");
    }
}

ShadyElement.Register(EmptyElement, { html: false } );