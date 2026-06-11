import { afterEach, describe, expect, it, vi } from "vitest";
import ARIATabManager from "../src/ARIATabManager";

function mount(html: string) {
  document.body.innerHTML = html;
}

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("hide strategy", () => {
  it("defaults content panels to data-ariamanager-hide=inert", () => {
    mount(`
      <div data-tab-container>
        <button aria-controls="a" aria-pressed="true" data-tab-button>A</button>
        <div id="a" aria-hidden="false" data-tab-content></div>
        <div id="b" aria-hidden="true" data-tab-content></div>
      </div>
    `);
    new ARIATabManager();

    const panels = document.querySelectorAll("[data-tab-content]");
    panels.forEach((p) =>
      expect(p.getAttribute("data-ariamanager-hide")).toBe("inert"),
    );
  });

  it("syncs the initial inert state to aria-hidden", () => {
    mount(`
      <div data-tab-container>
        <button aria-controls="a" data-tab-button>A</button>
        <div id="a" aria-hidden="false" data-tab-content></div>
        <div id="b" aria-hidden="true" data-tab-content></div>
      </div>
    `);
    new ARIATabManager();

    expect(document.getElementById("a")!.hasAttribute("inert")).toBe(false);
    expect(document.getElementById("b")!.hasAttribute("inert")).toBe(true);
  });

  it("does not override an explicit hide strategy", () => {
    mount(`
      <div data-tab-container>
        <button aria-controls="a" data-tab-button>A</button>
        <div id="a" aria-hidden="true" data-tab-content
             data-ariamanager-hide="hidden"></div>
      </div>
    `);
    new ARIATabManager();

    expect(
      document.getElementById("a")!.getAttribute("data-ariamanager-hide"),
    ).toBe("hidden");
    // inert is not applied when the panel opted into a different strategy.
    expect(document.getElementById("a")!.hasAttribute("inert")).toBe(false);
  });
});

describe("robustness", () => {
  it("does not throw without a DOM (SSR)", () => {
    vi.stubGlobal("document", undefined);
    expect(() => new ARIATabManager()).not.toThrow();
  });

  it("ignores a button that controls nothing", () => {
    mount(`
      <div data-tab-container>
        <button aria-controls="missing" data-tab-button>X</button>
      </div>
    `);
    new ARIATabManager();
    const button = document.querySelector("[data-tab-button]")!;
    expect(() =>
      button.dispatchEvent(new CustomEvent("beforeClick")),
    ).not.toThrow();
  });
});
