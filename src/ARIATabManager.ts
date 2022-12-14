// import { forEachChild } from "typescript";

/*
This script will listen to the states of WAI-ARIA buttons and makes sure that only one tab is open by default.
This is mostly used for toggling section visibility

Example:
<div data-tab-container>
    <button
        aria-controls="mycontent"
        aria-pressed="false"
        data-tab-button>Toggle</button>

    <div
        id="mycontent"
        aria-hidden="true"
        data-tab-content>Hidden until button is pressed</div>
</div>

using the attribute data-tab-selection-mode="allownone" will allow zero tabs to be open
*/
import AriaManager from "@wezz/ariamanager";
const ariaManager = new AriaManager();

class SelectionMode {
  public static AllowNone: string = "allownone";
  public static Default: string = "";
}

export default class ARIATabManager {
  private controlelements: HTMLElement[] = [];
  private controlselector = "[data-tab-container]";
  private contentselector = "[data-tab-content]";
  private contentcontainerselector = "[data-tab-contentcontainer]";
  private buttonselector = "[data-tab-button]";
  private tabmodeattributename = "data-tab-selection-mode";

  private defaultDelay = 0;
  constructor() {
    this.InitiateElements();
    this.checkPageHash();
  }

  public InitiateElements() {
    const controlElements = [].slice.call(
      document.querySelectorAll(this.controlselector)
    );
    const newElements = controlElements.filter(
      (elm) => (elm as HTMLElement).dataset.tabmanager !== "activated"
    );
    newElements.forEach(this.initiateElement.bind(this));
    newElements.forEach((elm) => (elm.dataset.tabmanager = "activated"));
    this.controlelements = ([] as HTMLElement[]).concat(
      this.controlelements,
      newElements
    );
  }

  private initiateElement(orgelm: HTMLElement) {
    this.setDefaultDelay(orgelm);
    if (orgelm.getAttribute("data-tab-setheight") === "true") {
      this.setContentHeight(orgelm);
      window.setInterval(() => {
        this.setContentHeight(orgelm);
      }, 1000);
    }
    this.bindEvents(orgelm);
  }

  private setDefaultDelay(orgelm: HTMLElement) {
    const attributeValue = orgelm.getAttribute(this.controlselector);
    let delayValue = this.defaultDelay;
    if (typeof attributeValue === "string" && attributeValue.length > 0) {
      const intAttributeValue = parseInt(attributeValue, 10);
      if (!isNaN(intAttributeValue)) {
        delayValue = intAttributeValue;
      }
    }
    orgelm.dataset.tabanimationdelay = delayValue + "";
  }
  private bindEvents(orgelm: Element) {
    const elm = orgelm as HTMLElement;

    const buttons: HTMLElement[] = this.getButtons(elm);
    const targets: HTMLElement[] = this.getTargets(elm);
    buttons.forEach((button) => {
      button.addEventListener(
        "beforeClick",
        this.onBeforeClick.bind(this, elm, button)
      );
    });
    //targets.forEach((target) => {
    //    target.addEventListener("aria-hidden-change", this.onAriaHiddenChange.bind(this, elm));
    //});
  }

  private async onBeforeClick(
    parent: HTMLElement,
    button: HTMLElement,
    e: any
  ) {
    const buttonTargets = await ariaManager.GetARIAControlTargets(button);
    const tabMode = parent.getAttribute(this.tabmodeattributename);
    const targetId = buttonTargets[0].id;

    const siblings = this.getTargets(parent).filter(
      (sibling: HTMLElement) => sibling.id !== targetId
    ) as HTMLElement[];

    siblings.forEach((sibling) => {
      ariaManager.AriaHidden(sibling, true);
      ariaManager.AriaExpand(sibling, false);
    });
    this.setPageHash(button);
    this.setContentHeight(parent);

    if (tabMode === SelectionMode.AllowNone) {
      return;
    }
    this.displayTarget(buttonTargets[0], parent);
  }
  private setPageHash(button: HTMLElement) {
    if (button.hasAttribute("data-tab-href")) {
      const hashhref = button.getAttribute("data-tab-href");
      if (!hashhref) {
        return;
      }
      if (history && typeof history.replaceState === "function") {
        history.replaceState({}, "", hashhref);
      } else {
        window.location.hash = hashhref;
      }
    }
  }

  private checkPageHash() {
    const hashArray = (window.location.hash + "").split(",").filter((x) => x);
    if (hashArray.length === 0) {
      return;
    }
    hashArray.forEach((hash) => {
      const buttons = Array.from(
        document.querySelectorAll('[data-tab-href="' + hash + '"]')
      );
      if (buttons && buttons.length > 0) {
        buttons.forEach((button) => {
          const buttonParent = this.getTabContainer(button as HTMLElement);
          if (buttonParent) {
            this.onBeforeClick(buttonParent, button as HTMLElement, null);
          }
        });
      }
    });
  }

  private getTabContainer(button: HTMLElement) {
    let parent = button.parentNode as HTMLElement;
    while (true) {
      if (parent.matches("body")) break;
      if (parent.hasAttribute("data-tab-container")) break;
      parent = parent.parentNode as HTMLElement; // get upper parent and check again
    }
    if (parent.matches("body")) parent = null; // when parent is a tag 'body' -> parent not found
    return parent;
  }

  private displayTarget(
    buttonTarget: HTMLElement,
    parent: HTMLElement,
    delayInMilliseconds: number = 180
  ) {
    window.setTimeout(() => {
      const targets = this.getTargets(parent);
      const hiddenTargets = targets.filter(
        (target: HTMLElement) => target.getAttribute("aria-hidden") === "true"
      ) as HTMLElement[];
      if (hiddenTargets.length === targets.length) {
        ariaManager.AriaHidden(buttonTarget, false);
        ariaManager.AriaExpand(buttonTarget, true);
      }
    }, delayInMilliseconds);
  }

  private getTargets(elm: Element) {
    return [].slice.call(elm.querySelectorAll(this.contentselector));
  }
  private getButtons(elm: Element) {
    return [].slice.call(elm.querySelectorAll(this.buttonselector));
  }
  private customEvent(name: string, details: object) {
    return new CustomEvent(name, {
      detail: details,
    });
  }

  private setContentHeight(elm: Element) {
    const contentContainer = elm.querySelector(this.contentcontainerselector);
    if (contentContainer && elm.getAttribute("data-tab-setheight") === "true") {
      const targets = this.getTargets(elm);
      let largestheight = 0;
      targets.forEach((target: Element) => {
        const targetRect = target.getClientRects()[0];
        if (targetRect && targetRect.height > largestheight) {
          largestheight = targetRect.height;
        }
      });
      if (largestheight > 0) {
        const styleValue = "height:" + largestheight + "px";
        contentContainer.setAttribute("style", styleValue);
      }
    }
  }
}
