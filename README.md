Shady-Components lets you to create absurdly simple WebComponents.

First let's create a WebComponent in a file called `UpperElement.js`:

```
import ShadyElement from "/node_modules/shady-components/shady.js"

export class UpperElement extends ShadyElement {

    get Upper() {
        return this.Data.Text.toUpperCase();
    }
}

ShadyElement.Register(UpperElement);
```

This registers a WebComponent `upper-element` with a property that returns the upper-case `Data.Text`. Now let's define the WebComponent's HTML.

Shady.js automatically requests an HTML file of the same name as the JS file, so in `UpperElement.html` we write:

```
<span>${Upper}</span>
```

This will insert the `Upper` property declared above when the WebComponent renders. The WebComponent `upper-element` is now complete!

To import it into a web-page, let's create an `index.html` page as such:

```
<html>
    <head>
        <script type="module" src="./UpperElement.js"></script>
    </head>
    <body>
        <div>
            <upper-element data-text="Hello, World!"></upper-element>
        </div>
    </body>
</html>
```

Parameters are passed into the WebComponent via `data-*` arguments, which are mapped to `Data.*` properties within the JS.

When we visit `index.html` we see:

```
HELLO, WORLD!
```

And that's it!

Check the examples for idea's on what this tech can be used for.

## FAQ

### What does this work on?

Currently this works with no other steps in Chrome. To make it work on other browsers requires a mix of steps involving translating it with `Babel.js` to a lower JS level and adding polyfills. An example of this can be found in the example `Polyfill Demo`.

### Are there more examples?

Sure, check out more examples here, with their code in the repo here.

### How on earth does it know where the HTML is?!

I'm sorry... please don't judge me.

Until various meta properties are exposed I had to do something slightly dirty. Ready yourself.. 

It uses `stacktrace.js` to access the current stack-trace and uses file-information from that to locate itself and the relative files.

### I cannot morally do that, can I inline the HTML and CSS?

Sure! Check out the `Inline Register` example to see how. The basic logic is to use a build-step to append the static members `.inlineHTML` & `inlineCSS` which shady.js will then use. Any help adding a guide or tool to gulp to do would be a great help!

## Warranty

It's hacky, slow and has terrible edge cases so should only really be used for making fun home projects.

## Credits

Currently I (Tom Bonner) have written the basic framework with the hope for more contributors.

The excellent people behind the Polymer Framework are owed credit given they were a major source of inspiration and introduced me to Web Components.