export default class ARIATabManager {
    private controlelements;
    private controlSelector;
    private contentSelector;
    private contentContainerSelector;
    private buttonSelector;
    private tabModeAttributeName;
    private tabMediaQueryAttributeName;
    private ariaManager;
    private defaultDelay;
    constructor(options?: ARIATabManagerInitiationOptions);
    private parseOptions;
    InitiateElements(parent?: HTMLElement): void;
    private initiateElement;
    private setDefaultDelay;
    private bindEvents;
    private onBeforeClick;
    private setPageHash;
    private checkPageHash;
    private getTabContainer;
    private displayTarget;
    private getTargets;
    private getButtons;
    private setContentHeight;
}
interface ARIATabManagerInitiationOptions {
    parent?: HTMLElement;
    initiateElements?: Boolean;
}
export {};
