import "jquery";
import { ViewManager, PossibleViews } from "./ViewManager";

export class Experiment {
    private viewManager: ViewManager;

    constructor() {
        this.viewManager = new ViewManager();
        this.viewManager.showView(PossibleViews.TRIAL, null);
    }
}