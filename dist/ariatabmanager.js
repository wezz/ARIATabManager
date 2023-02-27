var u = Object.defineProperty;
var g = (s, t, e) => t in s ? u(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var o = (s, t, e) => (g(s, typeof t != "symbol" ? t + "" : t, e), e);
var b = Object.defineProperty, E = (s, t, e) => t in s ? b(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e, c = (s, t, e) => (E(s, typeof t != "symbol" ? t + "" : t, e), e);
class f {
  constructor(t = document.body) {
    c(this, "controlelements", []), c(this, "controlselector", "[aria-controls]:not([data-ariamanager-ignore])"), c(this, "delayAttribute", "data-ariamanager-delay"), this.InitiateElements(t), window.addEventListener("global-markupchange", (e) => {
      var a;
      this.InitiateElements(((a = e == null ? void 0 : e.detail) == null ? void 0 : a.target) ?? document);
    });
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
    return e ? this.controlelements.filter(
      (a) => (a.getAttribute("aria-controls") + "").indexOf(e) !== -1
    ) : [];
  }
  GetARIAControlTargets(t) {
    const e = (t.getAttribute("aria-controls") + "").split(
      " "
    ), a = [], n = (i, r) => i.indexOf(r) === 0;
    return e.forEach((i) => {
      i = (!n(i, "#") && !n(i, ".") ? "#" : "") + i;
      const r = document.querySelector(i);
      r && a.push(r);
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
    const a = (r, l) => r.hasAttribute(l) ? r.getAttribute(l) : null, n = e.detail.target, i = a(n, "aria-hidden");
    t.hasAttribute("aria-pressed") && t.setAttribute("aria-pressed", (i === "false") + ""), t.hasAttribute("aria-expanded") && t.setAttribute("aria-expanded", (i === "false") + "");
  }
  setAriaHidden(t) {
    const e = t.detail.target, a = t.detail.value, n = this.GetARIAControllerFromTarget(e);
    e.setAttribute("aria-hidden", a), e.dispatchEvent(
      this.customEvent("aria-hidden-change", {
        target: e,
        value: a
      })
    ), n.forEach((i) => {
      i.dispatchEvent(
        this.customEvent("updateButtonState", {
          target: e
        })
      );
    });
  }
  setAriaExpanded(t) {
    const e = t.detail.target, a = t.detail.value, n = this.GetARIAControllerFromTarget(e);
    e.hasAttribute("data-aria-expanded") && e.setAttribute("data-aria-expanded", a + ""), e.dispatchEvent(
      this.customEvent("aria-expanded-change", {
        target: e,
        value: a
      })
    ), n.forEach((i) => {
      i.dispatchEvent(
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
        const n = a.getAttribute("aria-hidden") === "true";
        this.AriaHidden(a, !n);
      }
      if (t.hasAttribute("aria-expanded") || a.hasAttribute("data-aria-expanded")) {
        const n = a.getAttribute("aria-hidden") === "true";
        this.AriaExpand(a, !n);
      }
    });
  }
  getDelayValue(t) {
    let e = 0;
    const a = t.getAttribute(this.delayAttribute);
    if (typeof a == "string" && a.length > 0) {
      const n = parseInt(a, 10);
      isNaN(n) || (e = n);
    }
    return e;
  }
  customEvent(t, e) {
    return new CustomEvent(t, {
      detail: e
    });
  }
}
const d = new f(document.body);
class h {
}
o(h, "AllowNone", "allownone"), o(h, "Default", "");
class m {
  constructor() {
    o(this, "controlelements", []);
    o(this, "controlselector", "[data-tab-container]");
    o(this, "contentselector", "[data-tab-content]");
    o(this, "contentcontainerselector", "[data-tab-contentcontainer]");
    o(this, "buttonselector", "[data-tab-button]");
    o(this, "tabmodeattributename", "data-tab-selection-mode");
    o(this, "defaultDelay", 0);
    this.InitiateElements(), this.checkPageHash();
  }
  InitiateElements() {
    const e = [].slice.call(
      document.querySelectorAll(this.controlselector)
    ).filter(
      (a) => a.dataset.tabmanager !== "activated"
    );
    e.forEach(this.initiateElement.bind(this)), e.forEach((a) => a.dataset.tabmanager = "activated"), this.controlelements = [].concat(
      this.controlelements,
      e
    );
  }
  initiateElement(t) {
    this.setDefaultDelay(t), t.getAttribute("data-tab-setheight") === "true" && (this.setContentHeight(t), window.setInterval(() => {
      this.setContentHeight(t);
    }, 1e3)), this.bindEvents(t);
  }
  setDefaultDelay(t) {
    const e = t.getAttribute(this.controlselector);
    let a = this.defaultDelay;
    if (typeof e == "string" && e.length > 0) {
      const n = parseInt(e, 10);
      isNaN(n) || (a = n);
    }
    t.dataset.tabanimationdelay = a + "";
  }
  bindEvents(t) {
    const e = t;
    this.getButtons(e).forEach((n) => {
      n.addEventListener(
        "beforeClick",
        this.onBeforeClick.bind(this, e, n)
      );
    });
  }
  async onBeforeClick(t, e) {
    const a = await d.GetARIAControlTargets(e), n = t.getAttribute(this.tabmodeattributename), i = a[0].id;
    this.getTargets(t).filter(
      (l) => l.id !== i
    ).forEach((l) => {
      d.AriaHidden(l, !0), d.AriaExpand(l, !1);
    }), this.setPageHash(e), this.setContentHeight(t), n !== h.AllowNone && this.displayTarget(a[0], t);
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
      a && a.length > 0 && a.forEach((n) => {
        const i = this.getTabContainer(n);
        i && this.onBeforeClick(i, n);
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
      const n = this.getTargets(e);
      n.filter(
        (r) => r.getAttribute("aria-hidden") === "true"
      ).length === n.length && (d.AriaHidden(t, !1), d.AriaExpand(t, !0));
    }, a);
  }
  getTargets(t) {
    return [].slice.call(t.querySelectorAll(this.contentselector));
  }
  getButtons(t) {
    return [].slice.call(t.querySelectorAll(this.buttonselector));
  }
  setContentHeight(t) {
    const e = t.querySelector(this.contentcontainerselector);
    if (e && t.getAttribute("data-tab-setheight") === "true") {
      const a = this.getTargets(t);
      let n = 0;
      if (a.forEach((i) => {
        const r = i.getClientRects()[0];
        r && r.height > n && (n = r.height);
      }), n > 0) {
        const i = "height:" + n + "px";
        e.setAttribute("style", i);
      }
    }
  }
}
export {
  m as ARIATabManager
};
