import {ShadyElement} from "/shady.js"

export class UpdatingTextElement extends ShadyElement {
    connectedCallback() {
        super.connectedCallback();

        setInterval(() =>
        {
            this.DataText = (parseInt(this.DataText) + 1).toString();
        }, this.DataInterval);
    }
}

ShadyElement.Register(UpdatingTextElement, "/Examples/Updating Text/UpdatingTextElement/");
