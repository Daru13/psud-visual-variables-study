import { InitView } from "./views/InitView";
import { View } from "./views/View";
import { PauseView } from "./views/PauseView";
import { TrialView } from "./views/TrialView";

export enum PossibleViews {
    INIT = 1,
    PAUSE = 2,
    TRIAL = 3
}

export class ViewManager {
    views: Map<PossibleViews, View<any>>

    constructor() {
        this.views = new Map();
        this.views.set(PossibleViews.INIT, new InitView());
        this.views.set(PossibleViews.PAUSE, new PauseView());
        this.views.set(PossibleViews.TRIAL, new TrialView());
    }

    showView(view: PossibleViews, parameter: any){
        this.views.get(view).beforeRender(parameter);
        this.views.get(view).render();
    }
}