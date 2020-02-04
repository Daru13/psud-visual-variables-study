import "jquery";
import { ViewManager, PossibleViews } from "./ViewManager";
import { TrialTable } from "./TrialTable";
import { Session } from "./Session";
import { VisualVariable, ObjectCount } from "./Trial";
import { EventManager } from './events/EventManager';
import { SetupCompletionEvent } from './events/SetupCompletionEvent';
import { TrialSuccessEvent } from './events/TrialSuccessEvent';
import { PauseTimeoutEvent } from './events/PauseTimeoutEvent';

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

        this.registerEventHandlers();
        this.beginSetup();
    }

    private beginSetup() {
        this.state = ExperimentState.Setup;
        const participantsNb = this.trialTable.participantTrials.size;
        this.viewManager.showView(PossibleViews.INIT, { participantsNb: participantsNb });
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

    private onSetupCompletion(event: SetupCompletionEvent) {
        this.session = new Session(this.trialTable, event.participantID);
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
        EventManager.registerHandler(SetupCompletionEvent, (event: SetupCompletionEvent) => this.onSetupCompletion(event));
        EventManager.registerHandler(TrialSuccessEvent, () => this.onTrialSuccess());
        EventManager.registerHandler(PauseTimeoutEvent, () => this.onPauseTimeout());
    }
}