# Shady.js

Shady.js allows you to create absurdly simple WebComponents.

First let's create a WebComponent in `UpperElement.html`:

```
import ShadyElement from "/shady.js"

export class UpperElement extends ShadyElement {

    get Upper() {
        return this.Data.Text.toUpperCase();
    }
}

ShadyElement.Register(UpperElement);
```

This registers a WebComponent called `UpperElement` with a tag of `upper-element` with a property that returns the upper-case `Data.Text`. Now let's define the WebComponent's HTML.

Shady.js automatically requests an HTML file of the same name as the JS file, so in `UpperElement.html` we write:

```
<span>${Upper}</span>
```

This will insert the `Upper` property when the WebComponent renders. The WebComponent `upper-element` is now complete!

To import it into a site, let's create an `index.html` page as such:

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

Parameters are passed into the WebComponent via `data-*` arguments, which are mapped to `Data.*` properties within the JS which we use in the property.

When we visit `index.html` we see:

```
HELLO, WORLD!
```

And that's it!

## Are there more examples?

Sure, check out more examples here, with their representive code in the repo here.

## How on earth does it know where the HTML is?!

I'm sorry... 

Until various meta properties are exposed I had to do something slightly dirty. Ready yourself.. 

It uses `stacktrace.js` to acces the stacktrace and uses file-information from that to locate itself and the relative files.

## I morally cannot do that, can I inline the HTML and CSS?

Sure! Check out the `Inline Register` example to see how. The basic logic is to use a build-step to append the static members `.inlineHTML` & `inlineCSS` which shady.js will then use. Any help adding a guide or tool to gulp to do would be a great help!

## Warranty

It's hacky, slow, has terrible edge cases so should only really be used for making fun home projects.