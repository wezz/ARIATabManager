var h = Object.defineProperty;
var d = (s, t, e) => t in s ? h(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var n = (s, t, e) => d(s, typeof t != "symbol" ? t + "" : t, e);
import u from "@wezz/ariamanager";
class l {
}
n(l, "AllowNone", "allownone"), n(l, "TabletAccordion", "tabletaccordion"), n(l, "Default", "");
class g {
  constructor(t) {
    n(this, "controlelements", []);
    n(this, "controlSelector", "[data-tab-container]");
    n(this, "contentSelector", "[data-tab-content]");
    n(this, "contentContainerSelector", "[data-tab-contentcontainer]");
    n(this, "buttonSelector", "[data-tab-button]");
    n(this, "tabModeAttributeName", "data-tab-selection-mode");
    n(this, "tabMediaQueryAttributeName", "data-tab-mediaquery");
    n(this, "ariaManager");
    n(this, "defaultDelay", 0);
    const e = this.parseOptions(t);
    this.ariaManager = new u(t), e.initiateElements && this.InitiateElements(e.parent), this.checkPageHash();
  }
  parseOptions(t) {
    const e = { parent: document.body, initiateElements: !0 };
    return !t || typeof t != "object" || typeof t.parent > "u" && typeof t.initiateElements > "u" ? e : { ...e, ...t };
  }
  InitiateElements(t = document.body) {
    const i = [].slice.call(
      t.querySelectorAll(this.controlSelector)
    ).filter(
      (a) => a.dataset.tabmanager !== "activated"
    );
    i.forEach(this.initiateElement.bind(this)), i.forEach((a) => a.dataset.tabmanager = "activated"), this.controlelements = [].concat(
      this.controlelements,
      i
    );
  }
  initiateElement(t) {
    this.setDefaultDelay(t), t.getAttribute("data-tab-setheight") === "true" && (this.setContentHeight(t), window.setInterval(() => {
      this.setContentHeight(t);
    }, 1e3)), this.bindEvents(t);
  }
  setDefaultDelay(t) {
    const e = t.getAttribute(this.controlSelector);
    let i = this.defaultDelay;
    if (typeof e == "string" && e.length > 0) {
      const a = parseInt(e, 10);
      isNaN(a) || (i = a);
    }
    t.dataset.tabanimationdelay = i + "";
  }
  bindEvents(t) {
    const e = t;
    this.getButtons(e).forEach((a) => {
      a.addEventListener(
        "beforeClick",
        this.onBeforeClick.bind(this, e, a)
      );
    });
  }
  async onBeforeClick(t, e) {
    const i = await this.ariaManager.GetARIAControlTargets(e), a = t.getAttribute(this.tabModeAttributeName), r = i[0].id;
    if (a === l.TabletAccordion) {
      const c = t.hasAttribute(this.tabMediaQueryAttributeName) ? t.getAttribute(this.tabMediaQueryAttributeName) + "" : "only screen and (min-width: 768px)";
      if (typeof (window == null ? void 0 : window.matchMedia) < "u" && !window.matchMedia(c).matches)
        return;
    }
    this.getTargets(t).filter(
      (c) => c.id !== r
    ).forEach((c) => {
      this.ariaManager.AriaHidden(c, !0), this.ariaManager.AriaExpand(c, !1);
    }), this.setPageHash(e), this.setContentHeight(t), a !== l.AllowNone && this.displayTarget(i[0], t);
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
      const i = Array.from(
        document.querySelectorAll('[data-tab-href="' + e + '"]')
      );
      i && i.length > 0 && i.forEach((a) => {
        const r = this.getTabContainer(a);
        r && this.onBeforeClick(r, a);
      });
    });
  }
  getTabContainer(t) {
    let e = t.parentNode;
    for (; !(e.matches("body") || e.hasAttribute("data-tab-container")); )
      e = e.parentNode;
    return e.matches("body") ? null : e;
  }
  displayTarget(t, e, i = 180) {
    window.setTimeout(() => {
      const a = this.getTargets(e);
      a.filter(
        (o) => o.getAttribute("aria-hidden") === "true"
      ).length === a.length && (this.ariaManager.AriaHidden(t, !1), this.ariaManager.AriaExpand(t, !0));
    }, i);
  }
  getTargets(t) {
    return [].slice.call(t.querySelectorAll(this.contentSelector));
  }
  getButtons(t) {
    return [].slice.call(t.querySelectorAll(this.buttonSelector));
  }
  setContentHeight(t) {
    const e = t.querySelector(this.contentContainerSelector);
    if (e && t.getAttribute("data-tab-setheight") === "true") {
      const i = this.getTargets(t);
      let a = 0;
      if (console.log("targets", i), i.forEach((r) => {
        const o = r.getClientRects()[0];
        o && o.height > a && (a = o.height);
      }), a > 0) {
        const r = "height:" + a + "px";
        e.setAttribute("style", r);
      }
    }
  }
}
export {
  g as default
};
