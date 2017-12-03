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

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }

function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export class ShadyElement extends HTMLElement {

    constructor() {
        super();

        if (!window.shadyJs)
            window.shadyJs = {
                components: []
            }
    }

    async connectedCallback() {

        for (let attributeKey of Object.keys(this.dataset)) {

            let value = this.dataset[attributeKey];
            let propertyName = `Data${jsUcfirst(camelize(attributeKey))}`;

            console.log(`Defining property "${propertyName}" from attribute "data-${attributeKey}"`)
            
            Object.defineProperty(this, propertyName, {
                get: () => {
                    return this.dataset[attributeKey];
                },
                set: (val) => {
                    console.log("Setting val");
                    this.render();
                    this.dataset[attributeKey] = val;
                },
                writeable: true,
                configurable: true
            })
        }

        await Promise.all(this.constructor.loadingPromise);

        this.shadow = this.attachShadow({mode: "open"});

        this.render();

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

    render() {

        let wrappedCss = `<style>${this.constructor.css ? this.constructor.css : this.constructor.inlineCSS}</style>`;
        let wrappedHtml = this.constructor.html ? this.constructor.html : this.constructor.inlineHTML;

        let result;
        while ((result = /(\$\{.*\})/.exec(wrappedHtml)) !== null) {

            let toReplace = result[0];
            let key = result[0].replace("${", "").replace("}", "").replace("this.", "")

            let val = this[key];

            if (val instanceof Array)
                val = val.join("");
            if (val instanceof Object)
                val = JSON.stringify(val, null, 2).trim();

            wrappedHtml = wrappedHtml.replace(toReplace, val);
        }

        this.shadow.innerHTML = `${wrappedCss}${wrappedHtml}`
    }

    static async Init(obj) {

        let ourName = obj.name;
        let path = obj.srcPath;

        if (path != null) {

        if (obj.cssEnabled && !obj.css)
            obj.css = await (await fetch(`${window.location.origin}${path}${ourName}.css`)).text();

        if (!obj.html)
            obj.html = await (await fetch(`${window.location.origin}${path}${ourName}.html`)).text();
        }
    }

    static Register(obj, srcPathOrOptions) {

        let srcPath = null;
        let cssEnabled = false;

        if (typeof srcPathOrOptions == "string") {
            srcPath = srcPathOrOptions;
        } else if (typeof srcPathOrOptions == "object") {
            srcPath = "src" in srcPathOrOptions ? srcPathOrOptions.src : null;
            cssEnabled = "css" in srcPathOrOptions ? srcPathOrOptions.css : false;
        }

        obj.srcPath = srcPath;
        obj.cssEnabled = cssEnabled;

        let name = obj.name;

        name = name.replace(/(?!^)([A-Z])/g, "-$&").toLowerCase();

        console.log(`Defining custom element "${name}"`)

        this.loadingPromise = [];
        this.loadingPromise.push(this.Init(obj));

        customElements.define(name, obj);        
    }
}