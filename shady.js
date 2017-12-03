function readGetters(obj) {
    var result = [];
    Object.keys(obj).forEach((property) => {
        var descriptor = Object.getOwnPropertyDescriptor(obj, property);
        if (typeof descriptor.get === 'function') {
            result.push(property);
        }
    });
    return result;
}

export class ShadyJs extends HTMLElement {

    constructor() {
        super();

        if (!window.shadyJs)
            window.shadyJs = {
                components: []
            }
    }

    async connectedCallback() {

        for (let key of this.attributes) {

            let value = this.attributes[key];

            if (key instanceof Attr) {
                value = key.value;
                key = key.name;
            }

            try {
                value = JSON.parse(value)
            } catch (e) {
                console.log();
            }

            Object.defineProperty(this, key.toLowerCase(), {
                value: value,
                writeable: true,
                configurable: true
            })
        }

        await Promise.all(this.constructor.loadingPromise);

        this.shadow = this.attachShadow({mode: "open"});

        let wrappedCss = `<style>${this.constructor.css}</style>`;
        let wrappedHtml = this.constructor.html;

        let result;
        while ((result = /(\$\{.*\})/.exec(wrappedHtml)) !== null) {

            let toReplace = result[0];
            let key = result[0].replace("${", "").replace("}", "").replace("this.", "").toLowerCase();

            let val = this[key];

            if (val instanceof Array)
                val = val.join("");
            if (val instanceof Object)
                val = JSON.stringify(val, null, 2).trim();

            wrappedHtml = wrappedHtml.replace(toReplace, val);
        }

        this.render(wrappedCss, wrappedHtml);

        this.recursivelyLink(this.shadowRoot);

        this.querySelector = (selector) => {
            return this.shadow.querySelector(selector);
        };
    }

    recursivelyLink(node) {

        if ("attributes" in node) {
            for (let abb of node.attributes) {

                let attribute = abb.name;
                let value = abb.value;

                if (value.includes("()")) {
                    let func = value.replace("()", "");

                    if (func in this) {
                        node[attribute] = this[func].bind(this);
                    }
                }
            }
        }

        for (let child of node.childNodes) {
            this.recursivelyLink(child)
        }
    }

    render(css, html) {
        this.shadow.innerHTML = `${css}${html}`
    }

    static async Init(obj) {

        let ourName = obj.name;
        let path = obj.srcPath;

        if (!obj.css)
        {
            try {
                obj.css = await (await fetch(`${window.location.origin}${path}${ourName}.css`)).text();
            }
            catch (ex) {
                console.log(ex);
            }
        }

        if (!obj.html)
            obj.html = await (await fetch(`${window.location.origin}${path}${ourName}.html`)).text();
    }

    static Register(obj, srcPath) {

        obj.srcPath = srcPath;

        let name = obj.name;

        name = name.replace(/(?!^)([A-Z])/g, "-$&").toLowerCase();

        console.log(`Defining custom element "${name}"`)

        this.loadingPromise = [];
        this.loadingPromise.push(this.Init(obj));

        customElements.define(name, obj);        
    }
}