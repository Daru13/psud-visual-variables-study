import "jquery";
import { ViewManager, PossibleViews } from "./ViewManager";
import { TrialTable } from "./TrialTable";
import { Session } from "./Session";
import { VisualVariable, ObjectCount } from "./Trial";
import { EventManager } from './events/EventManager';
import { NewUserEvent } from './events/SetupCompletionEvent';

enum ExperimentState {
    Init,
    Setup,
    RunningTrial,
    Paused,
    Finished
}

export class Experiment {
    private state: ExperimentState;

    private viewManager: ViewManager;
    private trialTable: TrialTable;
    private session: Session;

    constructor() {
        this.state = ExperimentState.Init;

        this.viewManager = new ViewManager();
        this.trialTable = TrialTable.fromCSV();
        this.session = null;

        console.log(this);

        this.beginSetup();
    }

    private beginSetup() {
        this.state = ExperimentState.Setup;
        this.viewManager.showView(PossibleViews.INIT, null);
    }

    private beginSession() {
        this.state = ExperimentState.RunningTrial;
        this.runNextTrial();
    }

    private endSession() {
        this.state = ExperimentState.Finished;
        // TODO
    }

    private beginPause() {
        this.state = ExperimentState.Paused;
        this.viewManager.showView(PossibleViews.PAUSE, null);
    }

    private endPause() {
        this.state = ExperimentState.RunningTrial;
        this.runNextTrial();
    }

    private runNextTrial() {
        this.session.endCurrentTrial();
        const trial = this.session.getCurrentTrial();

        this.viewManager.showView(PossibleViews.TRIAL, trial);
    }

    private onSetupCompletion(event: NewUserEvent) {
        this.session = new Session(this.trialTable, event.userId);
        this.beginSession();
    }

    private onTrialSuccess() {
        if (this.session.isSessionFinished()) {
            this.endSession();
        }
        else if (this.session.isCurrentBlockFinished()) {
            this.beginPause();
        }
        else {
            this.runNextTrial();
        }
    }

    private onPauseTimeout() {
        this.endPause();
    }

    private registerEventHandlers() {
        // TODO
    }
}