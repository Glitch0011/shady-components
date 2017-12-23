import "/node_modules/stacktrace-js/dist/stacktrace.js"

export default class ShadyElement extends HTMLElement {

    constructor() {
        super();

        if (!window.shadyJs)
            window.shadyJs = {
                components: []
            }
    }

    getDataset(val) {
        for (let key in this.dataset) {
            if (key.toLowerCase() == val) {
                return key;
            }
        }
    }

    setDataset(val, data) {
        for (let key in this.dataset) {
            if (key.toLowerCase() == val) {

                if (data === false)
                    delete this.dataset[attributeKey]
                else if (data == true)
                    this.dataset[attributeKey] = "";
                else 
                    this.dataset[attributeKey] = data;
                    
                return;
            }
        }
    }

    async connectedCallback() {

        let handler = {
            get: (a, attributeKey) => {

                attributeKey = attributeKey.toLowerCase();

                let val = this.dataset[this.getDataset(attributeKey)]

                if (val == "")
                    return true;
                else if (val == "false" || val == undefined)
                    return false;
                else if (val == "true")
                    return true;
                else
                    return val;
            },
            set: (a, attributeKey, val) => {

                attributeKey = attributeKey.toLowerCase();

                console.debug(`${attributeKey} = ${val}`);

                this.setDataset(attributeKey, data);
                
                this.render();

                return true;
            }
        };

        this.Data = new Proxy({}, handler);

        for (let attributeKey of Object.keys(this.dataset)) {

            let value = this.dataset[attributeKey];
            console.log(`Defining property "Data.${attributeKey}" from attribute "data-${attributeKey}"`)
        }

        await Promise.all(this.constructor.loadingPromise);

        this.shadow = this.attachShadow({mode: "open"});

        this.render();

        this.querySelector = (selector) => {
            return this.shadow.querySelector(selector);
        };

        this.querySelectorAll = (selector) => {
            return this.shadow.querySelectorAll(selector);
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

    async render() {

        let css = this.constructor.css ? this.constructor.css : this.constructor.inlineCSS;

        let wrappedCss = css ? `<style>${css}</style>` : "";
        let wrappedHtml = this.constructor.html ? this.constructor.html : this.constructor.inlineHTML;

        let result;
        while ((result = /(\$\{.*\})/.exec(wrappedHtml)) !== null) {

            let toReplace = result[0];
            let key = result[0].replace("${", "").replace("}", "").replace("this.", "")

            let val = "";

            if (key in this) {

                let res = this[key];

                if (res instanceof Promise)
                    val = await res
                else
                    val = res;
            } else {
                val = this.Data[key];

                if (val instanceof Promise)
                    val = await val;

                if (val instanceof Array)
                    val = val.join("");
                if (val instanceof Object)
                    val = JSON.stringify(val, null, 2).trim();
            }
            wrappedHtml = wrappedHtml.replace(toReplace, val);
        }

        this.shadow.innerHTML = `${wrappedCss}${wrappedHtml ? wrappedHtml : ""}`

        this.recursivelyLink(this.shadowRoot);
    }

    static async Init(obj) {

        let stack = await StackTrace.get({offline: true});
    
        let fileName = stack[stack.length-1].fileName;

        let pathNoExtension = /(.*)\..*/.exec(fileName)[1];

        if (obj.cssEnabled && !obj.css && !obj.inlineCSS)
            obj.css = await (await fetch(`${pathNoExtension}.css`)).text();

        if (obj.htmlEnabled && !obj.html && !obj.inlineHTML)
            obj.html = await (await fetch(`${pathNoExtension}.html`)).text();
        return obj;
    }

    static Register(obj, options) {

        if (typeof options == "object") {
            obj.cssEnabled = "css" in options;

            if (!("html" in options))
                obj.htmlEnabled = true;
            else 
                obj.HTMLElement = options["html"];
        } else {
            obj.cssEnabled = false;
            obj.htmlEnabled = true;
        }

        let name = obj.name;

        name = name.replace(/(?!^)([A-Z])/g, "-$&").toLowerCase();

        console.log(`Defining custom element "${name}"`)

        if (!this.loadingPromise)
            this.loadingPromise = [];
            
        this.loadingPromise.push(this.Init(obj));

        customElements.define(name, obj);        
    }
}