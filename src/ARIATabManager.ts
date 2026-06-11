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
import ARIAManager from "@wezz/ariamanager";

class SelectionMode {
  public static AllowNone = "allownone";
  public static TabletAccordion = "tabletaccordion";
  public static Default = "";
}

export default class ARIATabManager {
  private controlelements: HTMLElement[] = [];
  private controlSelector = "[data-tab-container]";
  private contentSelector = "[data-tab-content]";
  private contentContainerSelector = "[data-tab-contentcontainer]";
  private buttonSelector = "[data-tab-button]";
  private tabModeAttributeName = "data-tab-selection-mode";
  private tabMediaQueryAttributeName = "data-tab-mediaquery";
  private delayAttribute = "data-tab-delay";
  private hideStrategyAttribute = "data-ariamanager-hide";
  private resizeObservers: ResizeObserver[] = [];
  private ariaManager!: ARIAManager;
  private defaultDelay = 0;
  constructor(options?: ARIATabManagerInitiationOptions) {
    if (typeof document === "undefined") {
      // No DOM (e.g. server-side rendering): do nothing. The first real
      // client-side construction will wire everything up.
      return;
    }
    const constructorOptions = this.parseOptions(options);
    this.ariaManager = new ARIAManager(options);
    if (constructorOptions.initiateElements) {
      this.InitiateElements(constructorOptions.parent);
    }

    this.checkPageHash();
  }
  private parseOptions(options?: ARIATabManagerInitiationOptions) {
    const defaultOptions = { parent: document.body, initiateElements: true };
    if (
      !options ||
      typeof options !== "object" ||
      (typeof options.parent === "undefined" &&
        typeof options.initiateElements === "undefined")
    ) {
      return defaultOptions;
    }
    return { ...defaultOptions, ...options };
  }

  public InitiateElements(parent: HTMLElement = document.body) {
    const controlElements = [].slice.call(
      parent.querySelectorAll(this.controlSelector),
    ) as HTMLElement[];
    const newElements = controlElements.filter(
      (elm) => elm.dataset.tabmanager !== "activated",
    );
    newElements.forEach(this.initiateElement.bind(this));
    newElements.forEach((elm) => (elm.dataset.tabmanager = "activated"));
    this.controlelements = ([] as HTMLElement[]).concat(
      this.controlelements,
      newElements,
    );
  }

  private initiateElement(orgelm: HTMLElement) {
    this.setDefaultDelay(orgelm);
    this.applyHideStrategy(orgelm);
    if (orgelm.getAttribute("data-tab-setheight") === "true") {
      this.setContentHeight(orgelm);
      this.observeContentHeight(orgelm);
    }
    this.bindEvents(orgelm);
  }

  // A hidden tab panel must leave the tab order, otherwise keyboard users tab
  // into off-screen controls. aria-hidden alone does not do this, so we ask the
  // underlying ARIAManager to also toggle `inert` (requires @wezz/ariamanager
  // >= 1.1). Opt out per panel by pre-setting data-ariamanager-hide yourself
  // (e.g. "hidden" or "none"); we only set a default when none is present, and
  // we sync the initial inert state to the panel's current aria-hidden value.
  private applyHideStrategy(parent: HTMLElement) {
    this.getTargets(parent).forEach((target: HTMLElement) => {
      if (!target.hasAttribute(this.hideStrategyAttribute)) {
        target.setAttribute(this.hideStrategyAttribute, "inert");
      }
      if (target.getAttribute(this.hideStrategyAttribute) === "inert") {
        target.toggleAttribute(
          "inert",
          target.getAttribute("aria-hidden") === "true",
        );
      }
    });
  }

  // Keep the content container tall enough for its largest panel. A
  // ResizeObserver fires only when a panel actually changes size, replacing the
  // old 1s polling interval that ran forever and stacked on re-initialisation.
  private observeContentHeight(orgelm: HTMLElement) {
    if (typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(() => this.setContentHeight(orgelm));
    this.getTargets(orgelm).forEach((target: HTMLElement) =>
      observer.observe(target),
    );
    this.resizeObservers.push(observer);
  }

  private setDefaultDelay(orgelm: HTMLElement) {
    const attributeValue = orgelm.getAttribute(this.delayAttribute);
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

    buttons.forEach((button) => {
      button.addEventListener(
        "beforeClick",
        this.onBeforeClick.bind(this, elm, button),
      );
    });
  }

  private onBeforeClick(parent: HTMLElement, button: HTMLElement) {
    const buttonTargets = this.ariaManager.GetARIAControlTargets(button);
    if (buttonTargets.length === 0) {
      // Button controls nothing resolvable — nothing to toggle.
      return;
    }
    const tabMode = parent.getAttribute(this.tabModeAttributeName);
    const targetId = buttonTargets[0].id;
    if (tabMode === SelectionMode.TabletAccordion) {
      const mediaQuery = parent.hasAttribute(this.tabMediaQueryAttributeName)
        ? parent.getAttribute(this.tabMediaQueryAttributeName) + ""
        : "only screen and (min-width: 768px)";
      if (typeof window?.matchMedia !== "undefined") {
        if (!window.matchMedia(mediaQuery).matches) {
          // If the media query matches we will not add the behavior for tabbing.
          // Instead we default to the standard ARIA Manager behavior
          // console.log('disabled tab manager behavior since the mediaQuery does not match')
          return;
        }
      }
    }

    const siblings = this.getTargets(parent).filter(
      (sibling: HTMLElement) => sibling.id !== targetId,
    ) as HTMLElement[];

    siblings.forEach((sibling) => {
      this.ariaManager.AriaHidden(sibling, true);
      this.ariaManager.AriaExpand(sibling, false);
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
        document.querySelectorAll('[data-tab-href="' + hash + '"]'),
      );
      if (buttons && buttons.length > 0) {
        buttons.forEach((button) => {
          const buttonParent = this.getTabContainer(button as HTMLElement);
          if (buttonParent) {
            this.onBeforeClick(buttonParent, button as HTMLElement);
          }
        });
      }
    });
  }

  private getTabContainer(button: HTMLElement) {
    let parent = button.parentNode as HTMLElement | null;
    while (parent && typeof parent.matches === "function") {
      if (parent.matches("body")) break;
      if (parent.hasAttribute("data-tab-container")) break;
      parent = parent.parentNode as HTMLElement | null; // climb and check again
    }
    if (!parent || parent.matches("body")) {
      return null;
    } // reached the body or a detached node -> container not found
    return parent;
  }

  private displayTarget(
    buttonTarget: HTMLElement,
    parent: HTMLElement,
    delayInMilliseconds = this.getConfiguredDelay(parent, 180),
  ) {
    window.setTimeout(() => {
      const targets = this.getTargets(parent);
      const hiddenTargets = targets.filter(
        (target: HTMLElement) => target.getAttribute("aria-hidden") === "true",
      ) as HTMLElement[];
      if (hiddenTargets.length === targets.length) {
        this.ariaManager.AriaHidden(buttonTarget, false);
        this.ariaManager.AriaExpand(buttonTarget, true);
      }
    }, delayInMilliseconds);
  }

  private getTargets(elm: Element) {
    return [].slice.call(elm.querySelectorAll(this.contentSelector));
  }
  private getButtons(elm: Element) {
    return [].slice.call(elm.querySelectorAll(this.buttonSelector));
  }

  // The per-container delay parsed by setDefaultDelay (from data-tab-delay),
  // falling back to the supplied default when none was configured.
  private getConfiguredDelay(parent: HTMLElement, fallback: number) {
    const configured = parseInt(parent.dataset.tabanimationdelay ?? "", 10);
    return isNaN(configured) || configured <= 0 ? fallback : configured;
  }

  private setContentHeight(elm: Element) {
    const contentContainer = elm.querySelector(this.contentContainerSelector);
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

interface ARIATabManagerInitiationOptions {
  parent?: HTMLElement;
  initiateElements?: boolean;
}
