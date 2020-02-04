import { Trial } from "./Trial";
import { TrialTable } from "./TrialTable";

export type ParticipantID = number;

export class Session {
    private participantID: number;

    private trials: Trial[];
    private currentTrialIndex: number;
    private currentTrial: Trial;

    constructor(trialTable: TrialTable, participantID: ParticipantID) {
        this.participantID = participantID;

        this.trials = trialTable.participantTrials.get(participantID)
            .sort((t1, t2) => t1.trialID - t2.trialID);
        
        this.currentTrialIndex = 0;
        this.currentTrial = this.trials[0];
    }
}