import "jquery";
import { ViewManager, PossibleViews } from "./ViewManager";
import { TrialTable } from "./TrialTable";
import { Session } from "./Session";
import { VisualVariable, ObjectCount } from "./Trial";
import { EventManager } from './events/EventManager';
import { SetupCompletionEvent } from './events/SetupCompletionEvent';
import { TrialSuccessEvent } from './events/TrialSuccessEvent';
import { PauseTimeoutEvent } from './events/PauseTimeoutEvent';
import { Logger } from "./Logger";

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
    private logger: Logger;
    private session: Session;

    constructor() {
        this.state = ExperimentState.Init;

        this.viewManager = new ViewManager();
        this.trialTable = TrialTable.fromCSV();
        this.logger = new Logger(this.trialTable);
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
        this.viewManager.showView(PossibleViews.FINAL, {
            fileName: `P${this.session.participantID}-${Date.now()}`,
            csv: this.logger.toCSV()
        });
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

    private onTrialSuccess(event: TrialSuccessEvent) {
        // Log the results of the current trial
        this.logger.log({
            trialID: this.session.getCurrentTrial().trialID,
            duration: event.duration,
            nbErrors: event.errorCount
        });

        // Continue the experiment
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
        EventManager.registerHandler(TrialSuccessEvent, (event: TrialSuccessEvent) => this.onTrialSuccess(event));
        EventManager.registerHandler(PauseTimeoutEvent, () => this.onPauseTimeout());
    }
}