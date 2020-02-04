import "jquery";
import { ViewManager, PossibleViews } from "./ViewManager";
import { TrialTable } from "./TrialTable";
import { Session } from "./Session";

export class Experiment {
    private viewManager: ViewManager;
    private trialTable: TrialTable;
    private session: Session;

    constructor() {
        this.viewManager = new ViewManager();
        this.trialTable = TrialTable.fromCSV();
        this.session = new Session(this.trialTable, 1);

        this.viewManager.showView(PossibleViews.TRIAL, null);
        console.log(this);
    }
}