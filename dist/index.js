var l = Object.defineProperty;
var d = (s, t, e) => t in s ? l(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var r = (s, t, e) => d(s, typeof t != "symbol" ? t + "" : t, e);
import u from "@wezz/ariamanager";
class c {
}
r(c, "AllowNone", "allownone"), r(c, "TabletAccordion", "tabletaccordion"), r(c, "Default", "");
class g {
  constructor(t) {
    r(this, "controlelements", []);
    r(this, "controlSelector", "[data-tab-container]");
    r(this, "contentSelector", "[data-tab-content]");
    r(this, "contentContainerSelector", "[data-tab-contentcontainer]");
    r(this, "buttonSelector", "[data-tab-button]");
    r(this, "tabModeAttributeName", "data-tab-selection-mode");
    r(this, "tabMediaQueryAttributeName", "data-tab-mediaquery");
    r(this, "delayAttribute", "data-tab-delay");
    r(this, "hideStrategyAttribute", "data-ariamanager-hide");
    r(this, "resizeObservers", []);
    r(this, "ariaManager");
    r(this, "defaultDelay", 0);
    if (typeof document > "u")
      return;
    const e = this.parseOptions(t);
    this.ariaManager = new u(t), e.initiateElements && this.InitiateElements(e.parent), this.checkPageHash();
  }
  parseOptions(t) {
    const e = { parent: document.body, initiateElements: !0 };
    return !t || typeof t != "object" || typeof t.parent > "u" && typeof t.initiateElements > "u" ? e : { ...e, ...t };
  }
  InitiateElements(t = document.body) {
    const a = [].slice.call(
      t.querySelectorAll(this.controlSelector)
    ).filter(
      (i) => i.dataset.tabmanager !== "activated"
    );
    a.forEach(this.initiateElement.bind(this)), a.forEach((i) => i.dataset.tabmanager = "activated"), this.controlelements = [].concat(
      this.controlelements,
      a
    );
  }
  initiateElement(t) {
    this.setDefaultDelay(t), this.applyHideStrategy(t), t.getAttribute("data-tab-setheight") === "true" && (this.setContentHeight(t), this.observeContentHeight(t)), this.bindEvents(t);
  }
  // A hidden tab panel must leave the tab order, otherwise keyboard users tab
  // into off-screen controls. aria-hidden alone does not do this, so we ask the
  // underlying ARIAManager to also toggle `inert` (requires @wezz/ariamanager
  // >= 1.1). Opt out per panel by pre-setting data-ariamanager-hide yourself
  // (e.g. "hidden" or "none"); we only set a default when none is present, and
  // we sync the initial inert state to the panel's current aria-hidden value.
  applyHideStrategy(t) {
    this.getTargets(t).forEach((e) => {
      e.hasAttribute(this.hideStrategyAttribute) || e.setAttribute(this.hideStrategyAttribute, "inert"), e.getAttribute(this.hideStrategyAttribute) === "inert" && e.toggleAttribute(
        "inert",
        e.getAttribute("aria-hidden") === "true"
      );
    });
  }
  // Keep the content container tall enough for its largest panel. A
  // ResizeObserver fires only when a panel actually changes size, replacing the
  // old 1s polling interval that ran forever and stacked on re-initialisation.
  observeContentHeight(t) {
    if (typeof ResizeObserver > "u")
      return;
    const e = new ResizeObserver(() => this.setContentHeight(t));
    this.getTargets(t).forEach(
      (a) => e.observe(a)
    ), this.resizeObservers.push(e);
  }
  setDefaultDelay(t) {
    const e = t.getAttribute(this.delayAttribute);
    let a = this.defaultDelay;
    if (typeof e == "string" && e.length > 0) {
      const i = parseInt(e, 10);
      isNaN(i) || (a = i);
    }
    t.dataset.tabanimationdelay = a + "";
  }
  bindEvents(t) {
    const e = t;
    this.getButtons(e).forEach((i) => {
      i.addEventListener(
        "beforeClick",
        this.onBeforeClick.bind(this, e, i)
      );
    });
  }
  onBeforeClick(t, e) {
    const a = this.ariaManager.GetARIAControlTargets(e);
    if (a.length === 0)
      return;
    const i = t.getAttribute(this.tabModeAttributeName), n = a[0].id;
    if (i === c.TabletAccordion) {
      const h = t.hasAttribute(this.tabMediaQueryAttributeName) ? t.getAttribute(this.tabMediaQueryAttributeName) + "" : "only screen and (min-width: 768px)";
      if (typeof (window == null ? void 0 : window.matchMedia) < "u" && !window.matchMedia(h).matches)
        return;
    }
    this.getTargets(t).filter(
      (h) => h.id !== n
    ).forEach((h) => {
      this.ariaManager.AriaHidden(h, !0), this.ariaManager.AriaExpand(h, !1);
    }), this.setPageHash(e), this.setContentHeight(t), i !== c.AllowNone && this.displayTarget(a[0], t);
  }
  setPageHash(t) {
    if (t.hasAttribute("data-tab-href")) {
      const e = t.getAttribute("data-tab-href");
      if (!e)
        return;
      history && typeof history.replaceState == "function" ? history.replaceState({}, "", e) : window.location.hash = e;
    }
  }
  checkPageHash() {
    const t = (window.location.hash + "").split(",").filter((e) => e);
    t.length !== 0 && t.forEach((e) => {
      const a = Array.from(
        document.querySelectorAll('[data-tab-href="' + e + '"]')
      );
      a && a.length > 0 && a.forEach((i) => {
        const n = this.getTabContainer(i);
        n && this.onBeforeClick(n, i);
      });
    });
  }
  getTabContainer(t) {
    let e = t.parentNode;
    for (; e && typeof e.matches == "function" && !(e.matches("body") || e.hasAttribute("data-tab-container")); )
      e = e.parentNode;
    return !e || e.matches("body") ? null : e;
  }
  displayTarget(t, e, a = this.getConfiguredDelay(e, 180)) {
    window.setTimeout(() => {
      const i = this.getTargets(e);
      i.filter(
        (o) => o.getAttribute("aria-hidden") === "true"
      ).length === i.length && (this.ariaManager.AriaHidden(t, !1), this.ariaManager.AriaExpand(t, !0));
    }, a);
  }
  getTargets(t) {
    return [].slice.call(t.querySelectorAll(this.contentSelector));
  }
  getButtons(t) {
    return [].slice.call(t.querySelectorAll(this.buttonSelector));
  }
  // The per-container delay parsed by setDefaultDelay (from data-tab-delay),
  // falling back to the supplied default when none was configured.
  getConfiguredDelay(t, e) {
    const a = parseInt(t.dataset.tabanimationdelay ?? "", 10);
    return isNaN(a) || a <= 0 ? e : a;
  }
  setContentHeight(t) {
    const e = t.querySelector(this.contentContainerSelector);
    if (e && t.getAttribute("data-tab-setheight") === "true") {
      const a = this.getTargets(t);
      let i = 0;
      if (a.forEach((n) => {
        const o = n.getClientRects()[0];
        o && o.height > i && (i = o.height);
      }), i > 0) {
        const n = "height:" + i + "px";
        e.setAttribute("style", n);
      }
    }
  }
}
export {
  g as default
};
