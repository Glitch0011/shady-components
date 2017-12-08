import ShadyElement from "/shady.js"

export class FlippingElement extends ShadyElement {

    get Class() {
        return this.Data.Enabled ? "on" : "off";
    }
    
    connectedCallback() {
        super.connectedCallback();

        setInterval(() => {
            this.Data.Enabled = !this.Data.Enabled;
        }, 1000);
    }
}

ShadyElement.Register(FlippingElement);