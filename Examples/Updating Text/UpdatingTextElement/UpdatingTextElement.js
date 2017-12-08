import {ShadyElement} from "/shady.js"

export class UpdatingTextElement extends ShadyElement {
    connectedCallback() {
        super.connectedCallback();

        setInterval(() =>
        {
            this.Data.Text = (parseInt(this.Data.Text) + 1).toString();
        }, this.Data.Interval);
    }
}

ShadyElement.Register(UpdatingTextElement, "/Examples/Updating Text/UpdatingTextElement/");
