declare class ARIATabManager {
    private controlelements;
    private controlSelector;
    private contentSelector;
    private contentContainerSelector;
    private buttonSelector;
    private tabModeAttributeName;
    private tabMediaQueryAttributeName;
    private delayAttribute;
    private hideStrategyAttribute;
    private resizeObservers;
    private ariaManager;
    private defaultDelay;
    constructor(options?: ARIATabManagerInitiationOptions);
    private parseOptions;
    InitiateElements(parent?: HTMLElement): void;
    private initiateElement;
    private applyHideStrategy;
    private observeContentHeight;
    private setDefaultDelay;
    private bindEvents;
    private onBeforeClick;
    private setPageHash;
    private checkPageHash;
    private getTabContainer;
    private displayTarget;
    private getTargets;
    private getButtons;
    private getConfiguredDelay;
    private setContentHeight;
}

declare interface ARIATabManagerInitiationOptions {
    parent?: HTMLElement;
    initiateElements?: boolean;
}
export = ARIATabManager;
