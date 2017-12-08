import ShadyElement from "/shady.js"

export class ClickableElement extends ShadyElement {

    onClick(e) {
        console.log(e, "clicked");
        this.Data.Checked = !this.Data.Checked;
    }
}

ShadyElement.Register(ClickableElement, { css: true });