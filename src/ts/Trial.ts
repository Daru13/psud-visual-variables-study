import { ParticipantID } from './Session';
import { CSVDataRow } from "./TrialTable";

export enum VisualVariable {
    Unknown,

    Hue,
    Saturation,
    HueAndSaturation
}

export enum ObjectCount {
    Unknown,

    Low,
    Medium,
    High
}

export type TrialID = number;

export class Trial {
    trialID: TrialID;
    participantID: ParticipantID;
    block: number;
    visualVariable: VisualVariable;
    objectCount: ObjectCount;

    constructor(trialID: TrialID,
                participantID: ParticipantID,
                block: number,
                visualVariable: VisualVariable,
                objectCount: ObjectCount) {
        this.trialID = trialID;
        this.participantID = participantID;
        this.block = block;
        this.visualVariable = visualVariable;
        this.objectCount = objectCount;
    }

    static fromCSVRow(row: CSVDataRow): Trial {
        const trialID = parseInt(row["TrialID"]);
        const participantID = parseInt(row["ParticipantID"]);
        const block = parseInt(row["Block1"]);

        const visualVariable = row["VV"] === "Hue" ? VisualVariable.Hue
                             : row["VV"] === "Saturation" ? VisualVariable.Saturation
                             : row["VV"] === "Hue_Saturation" ? VisualVariable.HueAndSaturation
                             : VisualVariable.Unknown;

        const objectCount = row["OC"] === "Low" ? ObjectCount.Low
                          : row["OC"] === "Medium" ? ObjectCount.Medium
                          : row["OC"] === "High" ? ObjectCount.High
                          : ObjectCount.Unknown;

        return new Trial(trialID, participantID, block, visualVariable, objectCount);
    }
}