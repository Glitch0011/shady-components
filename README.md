# Shady.js

Shady.js allows you to create absurdly simple WebComponents.

You start with a solid file-structure:

```
- Basic Text
|
-- index.html
-- TextElement
 |
 -- TextElement.html
 -- TextElement.js
```

First let's fill in some get some HTML to `index.html`:

```
<html>
    <head>
        <script type="module" src="./TextElement/TextElement.js"></script>
    </head>
    <body>
        <text-element data-name="Tom"></text-element>
    </body>
</html>
```

Now let's create a vauge html within `TextElement.html`:

```
<div>
    <span>Hi ${Name}</span>
</div>
```

Notice how we use the exact same fantastic string interpolation coming in ES2017. Now we just need some javasciprt to describe the WebComponent in `TextElement.js`:

```
import ShadyElement from "/shady.js"

export class TextElement extends ShadyElement {
    
}

ShadyElement.Register(TextElement);

```

And that's it! Now if you navigate to that page you'll see the page correctly showing `Hi Tom`. I've really tried to get rid of the final TextElement line but that's tricky (thoughts welcome as a PR).


## Warranty

It's hacky, slow, has terrible edge cases and should only really be used for making fun home projects.