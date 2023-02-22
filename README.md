# ARIA Tab Manager

This is a Tab Management script that takes advantage of (ARIA Manager)[https://github.com/wezz/ARIAManager]
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

### Tab markup example
```
<div data-tab-container>  
  <button
      aria-controls="mycontent1"
      aria-pressed="false"
      data-tab-button>Tab 1</button>
  <button
      aria-controls="mycontent2"
      aria-pressed="false"
      data-tab-button>Tab 2</button>
  
  <div data-tab-contentcontainer>
      <div
      id="mycontent1"
      aria-hidden="false"
      data-tab-content>Tab 1</div>
      <div
      id="mycontent2"
      aria-hidden="true"
      data-tab-content>Tab 2</div>
  </div>
</div>
```



## Development & Demo
Clone this repo
Run
``` npm install ```

To run the interactive demo, run 
``` npm run demo ```
