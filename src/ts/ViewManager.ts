import { InitView } from "./views/InitView";
import { View } from "./views/View";
import { PauseView } from "./views/PauseView";
import { TrialView } from "./views/TrialView";
import { FinalView } from './views/FinalView';

export enum PossibleViews {
    INIT = 1,
    PAUSE = 2,
    TRIAL = 3,
    FINAL
}

export class ViewManager {
    views: Map<PossibleViews, View<any>>
    currentView: View<any>;

    constructor() {
        this.views = new Map();
        this.views.set(PossibleViews.INIT, new InitView());
        this.views.set(PossibleViews.PAUSE, new PauseView());
        this.views.set(PossibleViews.TRIAL, new TrialView());
        this.views.set(PossibleViews.FINAL, new FinalView());
    }

    showView(view: PossibleViews, parameter: object = {}){
        if (this.currentView) {
            this.currentView.destroy();
        }
        this.currentView = this.views.get(view);
        this.currentView.beforeRender(parameter);
        this.currentView.render();
    }
}