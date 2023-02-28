export default class ARIATabManager {
    private controlelements;
    private controlSelector;
    private contentSelector;
    private contentContainerSelector;
    private buttonSelector;
    private tabModeAttributeName;
    private tabMediaQueryAttributeName;
    private defaultDelay;
    constructor();
    InitiateElements(): void;
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
