var h = Object.defineProperty;
var u = (r, t, e) => t in r ? h(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var o = (r, t, e) => (u(r, typeof t != "symbol" ? t + "" : t, e), e);
var b = Object.defineProperty, g = (r, t, e) => t in r ? b(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, c = (r, t, e) => (g(r, typeof t != "symbol" ? t + "" : t, e), e);
class f {
  constructor(t) {
    c(this, "controlelements", []), c(this, "controlselector", "[aria-controls]:not([data-ariamanager-ignore])"), c(this, "delayAttribute", "data-ariamanager-delay");
    const e = this.parseOptions(t);
    e.initiateElements && (this.InitiateElements(e.parent), window.addEventListener("global-markupchange", (a) => {
      var i;
      this.InitiateElements(((i = a == null ? void 0 : a.detail) == null ? void 0 : i.target) ?? document);
    }));
  }
  parseOptions(t) {
    const e = { parent: document.body, initiateElements: !0 };
    return !t || typeof t != "object" || typeof t.parent > "u" && typeof t.initiateElements > "u" ? e : { ...e, ...t };
  }
  InitiateElements(t = document.body) {
    const e = [].slice.call(
      t.querySelectorAll(this.controlselector)
    ).filter((a) => a.dataset.ariamanager !== "activated");
    e.forEach((a) => {
      this.bindEvents(a), a.dataset.ariamanager = "activated";
    }), this.controlelements = [].concat(
      this.controlelements,
      e
    );
  }
  AriaExpand(t, e) {
    t && (this.bindEventsToTargetElements(t), t.dispatchEvent(
      this.customEvent("set-aria-expanded", {
        target: t,
        value: e
      })
    ));
  }
  AriaHidden(t, e) {
    t && (this.bindEventsToTargetElements(t), t.dispatchEvent(
      this.customEvent("set-aria-hidden", {
        target: t,
        value: e
      })
    ));
  }
  GetARIAControllerFromTarget(t) {
    const e = t.getAttribute("id") + "";
    return e ? this.controlelements.filter((a) => (a.getAttribute("aria-controls") + "").split(" ").indexOf(e) !== -1) : [];
  }
  GetARIAControlTargets(t) {
    const e = (t.getAttribute("aria-controls") + "").split(
      " "
    ), a = [], i = (n, s) => n.indexOf(s) === 0;
    return e.forEach((n) => {
      n = (!i(n, "#") && !i(n, ".") ? "#" : "") + n;
      const s = document.querySelector(n);
      s && a.push(s);
    }), a;
  }
  onButtonClick(t) {
    const e = this.getDelayValue(t);
    t.dispatchEvent(
      this.customEvent("beforeClick", {
        delay: e,
        elm: t
      })
    ), window.setTimeout(() => {
      t.dispatchEvent(
        this.customEvent("adjustTargetStates", {
          elm: t
        })
      );
    }, e);
  }
  bindEvents(t) {
    const e = t;
    this.bindEventsToControlElements(e), this.GetARIAControlTargets(e).forEach((a) => {
      this.bindEventsToTargetElements(a);
    });
  }
  bindEventsToTargetElements(t) {
    t.dataset.ariamanager_eventbindings !== "true" && (t.addEventListener("set-aria-hidden", this.setAriaHidden.bind(this)), t.addEventListener(
      "set-aria-expanded",
      this.setAriaExpanded.bind(this)
    ), t.dataset.ariamanager_eventbindings = "true");
  }
  bindEventsToControlElements(t) {
    t.addEventListener("click", this.onButtonClick.bind(this, t)), t.addEventListener("beforeClick", this.beforeClickEvent.bind(this, t)), t.addEventListener(
      "adjustTargetStates",
      this.adjustTargetStates.bind(this, t)
    ), t.addEventListener(
      "updateButtonState",
      this.updateButtonState.bind(this, t)
    );
  }
  updateButtonState(t, e) {
    const a = (s, d) => s.hasAttribute(d) ? s.getAttribute(d) : null, i = e.detail.target, n = a(i, "aria-hidden");
    t.hasAttribute("aria-pressed") && t.setAttribute("aria-pressed", (n === "false") + ""), t.hasAttribute("aria-expanded") && t.setAttribute("aria-expanded", (n === "false") + "");
  }
  setAriaHidden(t) {
    const e = t.detail.target, a = t.detail.value, i = this.GetARIAControllerFromTarget(e);
    e.setAttribute("aria-hidden", a), e.dispatchEvent(
      this.customEvent("aria-hidden-change", {
        target: e,
        value: a
      })
    ), i.forEach((n) => {
      n.dispatchEvent(
        this.customEvent("updateButtonState", {
          target: e
        })
      );
    });
  }
  setAriaExpanded(t) {
    const e = t.detail.target, a = t.detail.value, i = this.GetARIAControllerFromTarget(e);
    e.hasAttribute("data-aria-expanded") && e.setAttribute("data-aria-expanded", a + ""), e.dispatchEvent(
      this.customEvent("aria-expanded-change", {
        target: e,
        value: a
      })
    ), i.forEach((n) => {
      n.dispatchEvent(
        this.customEvent("updateButtonState", {
          target: e
        })
      );
    });
  }
  beforeClickEvent(t, e) {
  }
  adjustTargetStates(t, e) {
    this.GetARIAControlTargets(t).forEach((a) => {
      if (a.hasAttribute("aria-hidden")) {
        const i = a.getAttribute("aria-hidden") === "true";
        this.AriaHidden(a, !i);
      }
      if (t.hasAttribute("aria-expanded") || a.hasAttribute("data-aria-expanded")) {
        const i = a.getAttribute("aria-hidden") === "true";
        this.AriaExpand(a, !i);
      }
    });
  }
  getDelayValue(t) {
    let e = 0;
    const a = t.getAttribute(this.delayAttribute);
    if (typeof a == "string" && a.length > 0) {
      const i = parseInt(a, 10);
      isNaN(i) || (e = i);
    }
    return e;
  }
  customEvent(t, e) {
    return new CustomEvent(t, {
      detail: e
    });
  }
}
class l {
}
o(l, "AllowNone", "allownone"), o(l, "TabletAccordion", "tabletaccordion"), o(l, "Default", "");
class A {
  constructor(t) {
    o(this, "controlelements", []);
    o(this, "controlSelector", "[data-tab-container]");
    o(this, "contentSelector", "[data-tab-content]");
    o(this, "contentContainerSelector", "[data-tab-contentcontainer]");
    o(this, "buttonSelector", "[data-tab-button]");
    o(this, "tabModeAttributeName", "data-tab-selection-mode");
    o(this, "tabMediaQueryAttributeName", "data-tab-mediaquery");
    o(this, "ariaManager");
    o(this, "defaultDelay", 0);
    const e = this.parseOptions(t);
    this.ariaManager = new f(t), e.initiateElements && this.InitiateElements(e.parent), this.checkPageHash();
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
    this.setDefaultDelay(t), t.getAttribute("data-tab-setheight") === "true" && (this.setContentHeight(t), window.setInterval(() => {
      this.setContentHeight(t);
    }, 1e3)), this.bindEvents(t);
  }
  setDefaultDelay(t) {
    const e = t.getAttribute(this.controlSelector);
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
  async onBeforeClick(t, e) {
    const a = await this.ariaManager.GetARIAControlTargets(e), i = t.getAttribute(this.tabModeAttributeName), n = a[0].id;
    if (i === l.TabletAccordion) {
      const d = t.hasAttribute(this.tabMediaQueryAttributeName) ? t.getAttribute(this.tabMediaQueryAttributeName) + "" : "only screen and (min-width: 768px)";
      if (typeof (window == null ? void 0 : window.matchMedia) < "u" && !window.matchMedia(d).matches)
        return;
    }
    this.getTargets(t).filter(
      (d) => d.id !== n
    ).forEach((d) => {
      this.ariaManager.AriaHidden(d, !0), this.ariaManager.AriaExpand(d, !1);
    }), this.setPageHash(e), this.setContentHeight(t), i !== l.AllowNone && this.displayTarget(a[0], t);
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
    for (; !(e.matches("body") || e.hasAttribute("data-tab-container")); )
      e = e.parentNode;
    return e.matches("body") ? null : e;
  }
  displayTarget(t, e, a = 180) {
    window.setTimeout(() => {
      const i = this.getTargets(e);
      i.filter(
        (s) => s.getAttribute("aria-hidden") === "true"
      ).length === i.length && (this.ariaManager.AriaHidden(t, !1), this.ariaManager.AriaExpand(t, !0));
    }, a);
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
      const a = this.getTargets(t);
      let i = 0;
      if (console.log("targets", a), a.forEach((n) => {
        const s = n.getClientRects()[0];
        s && s.height > i && (i = s.height);
      }), i > 0) {
        const n = "height:" + i + "px";
        e.setAttribute("style", n);
      }
    }
  }
}
export {
  A as default
};
