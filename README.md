# ARIA Tab Manager

This is a Tab Management script that takes advantage of [ARIA Manager](https://github.com/wezz/ARIAManager)
By adding data attributes to markup it will take care of aria attributes which can e used to style the tabs.

## Installation

`@wezz/ariamanager` is a **peer dependency** — install both. ARIA Tab Manager no
longer bundles its own copy of ARIA Manager, so the two share a single instance
and ariamanager updates apply without republishing this package.

```
npm install @wezz/ariamanager @wezz/ariatabmanager
```

> Requires `@wezz/ariamanager` >= 1.1.2.

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

### Open delay
Add **data-tab-delay** (milliseconds) to a container to delay opening the
selected panel — useful for letting a close animation finish first.

```<div data-tab-container data-tab-delay="180">...</div>```

## Accessibility: hidden panels leave the tab order
Each `data-tab-content` panel defaults to `data-ariamanager-hide="inert"`, so a
hidden tab is also marked [`inert`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert)
— keyboard users can't tab into off-screen panels (`aria-hidden` alone does not
do this). The initial `inert` state is synced to each panel's `aria-hidden`, so
markup just needs the correct `aria-hidden` values.

To opt out or change the strategy on a specific panel, set the attribute
yourself before initialisation:

```html
<!-- use the `hidden` attribute instead of `inert` -->
<div id="mycontent" aria-hidden="true" data-tab-content data-ariamanager-hide="hidden"></div>

<!-- disable it entirely (aria-hidden only) -->
<div id="mycontent" aria-hidden="true" data-tab-content data-ariamanager-hide="none"></div>
```

> Requires `@wezz/ariamanager` >= 1.1, which performs the `inert`/`hidden` toggle.

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


## Changelog

See [CHANGELOG.md](./CHANGELOG.md). This project follows
[Keep a Changelog](https://keepachangelog.com/) and
[Semantic Versioning](https://semver.org/).

### Releasing

1. Move the entries under `## [Unreleased]` in `CHANGELOG.md` into a new
   `## [x.y.z] - YYYY-MM-DD` section.
2. Bump `version` in `package.json` to match.
3. Run `npm run check:exports` (publint + are-the-types-wrong).
4. `npm publish` — `prepublishOnly` rebuilds and runs `publint`.

## Development & Demo
Clone this repo
Run
``` npm install ```

To run the demo, run
``` npm run dev ```