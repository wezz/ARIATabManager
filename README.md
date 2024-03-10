# ARIA Tab Manager

This is a Tab Management script that takes advantage of [ARIA Manager](https://github.com/wezz/ARIAManager)
By adding data attributes to markup it will take care of aria attributes which can e used to style the tabs.

## Installation
```
npm install @wezz/ariamanager
npm install @wezz/ariatabmanager
```

## Usage
### Initialize ARIA Manager & ARIA Tab Manager
```
import ARIAManager from "@wezz/ariamanager";
import ARIATabManager from "@wezz/ariatabmanager";
// On document ready
new ARIAManager();
new ARIATabManager();
```

#### Initiation options
The constructor can take the following options object:
```
const ariaOptions = { 
    parent: document.body, // This defined the entrypoint where ARIA Manager will query for relevant elements
    initiateElements: true // This disables the automatic initiation
};
new ARIAManager(ariaOptions);
new ARIATabManager(ariaOptions);
```

### Tab markup example
```
<div data-tab-container>
    <button aria-controls="mycontent1" aria-pressed="false" data-tab-button>Tab 1</button>
    <button aria-controls="mycontent2" aria-pressed="false" data-tab-button>Tab 2</button>

    <div data-tab-contentcontainer>
        <div id="mycontent1" aria-hidden="false" data-tab-content>Tab 1</div>
        <div id="mycontent2" aria-hidden="true" data-tab-content>Tab 2</div>
    </div>
</div>
```

## Optional behavior
There is a additional parameter **data-tab-selection-mode** which will allow users to close all tabs.

```<div data-tab-container data-tab-selection-mode="allownone">...</div>```

## More examples
See [the example html page](https://github.com/wezz/ARIATabManager/blob/main/index.html) for more examples on how to implement the ARIATabManager

## Related packages
### ARIAManager
[ARIAManager](https://github.com/wezz/ARIAManager) is the engine that drives the ARIATabManager. It handles the relationship between ```aria-controls``` elements and their targets.

### [MatchMedia Attribute Manager](https://github.com/wezz/MatchMediaAttributeManager)
Adding a ```aria-hidden``` attribute and not using it for it's intended use is bad for accessibility.<br>
Elements can be visually visible but hidden for users using screenreaders and more. 

The MatchMedia Attribute Manager makes it possible to remove or add ```aria-hidden``` depending on a media query.

Use cases can be that you want to show a navigation in desktop, but in mobile it's supposed to be hidden by default and toggled by a button.


## Development & Demo
Clone this repo
Run
``` npm install ```

To run the demo, run
``` npm run dev ```