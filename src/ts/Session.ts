import { Trial } from "./Trial";
import { TrialTable } from "./TrialTable";

export type ParticipantID = number;

export class Session {
    readonly participantID: number;

    private trials: Trial[];
    private currentTrialIndex: number;
    private currentTrial: Trial;

    constructor(trialTable: TrialTable, participantID: ParticipantID) {
        this.participantID = participantID;

        this.trials = trialTable.participantTrials.get(participantID)
            .sort((t1, t2) => t1.trialID - t2.trialID)
            .sort((t1, t2) => t1.block - t2.block);
        
        this.currentTrialIndex = 0;
        this.currentTrial = this.trials[0];
    }

    isCurrentBlockFinished(): boolean {
        return this.isSessionFinished()
            || this.currentTrial.block !== this.trials[this.currentTrialIndex + 1].block;
    }

    isSessionFinished(): boolean {
        return this.currentTrialIndex === this.trials.length - 1;
    }

    getCurrentTrial(): Trial {
        return this.currentTrial;
    }

    endCurrentTrial(): void {
        if (this.isSessionFinished()) {
            return;
        }

        this.currentTrialIndex++;
        this.currentTrial = this.trials[this.currentTrialIndex];
    }
}