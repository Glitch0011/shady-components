import ShadyElement from "/shady.js"

export class ClickableElement extends ShadyElement {

    onClick(e) {
        this.Data.Checked = !this.Data.Checked;
    }
}

ShadyElement.Register(ClickableElement, { css: true });