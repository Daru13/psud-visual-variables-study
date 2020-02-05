import * as Papa from "papaparse";
import { TrialTable, CSVDataRow, CSVData } from './TrialTable';
import { TrialID } from './Trial';
import { ParticipantID } from './Session';

interface Log {
    trialID: TrialID;
    duration: number;
    nbErrors: number;
}

export class Logger {
    private static readonly LOCAL_STORAGE_KEY = "experimentLogs";

    private trialTable: TrialTable;
    private participantID: ParticipantID;
    private logs: Map<TrialID, Log>;

    constructor(trialTable: TrialTable, participantID: ParticipantID) {
        this.trialTable = trialTable;
        this.participantID = participantID;
        this.logs = new Map();
    }

    log(log: Log): void {
        this.logs.set(log.trialID, log);
        this.saveIntoLocalStorage();
    }

    toCSV(): string {
        const csvData = JSON.parse(JSON.stringify(this.trialTable.sourceCSVData)) as CSVData;
        const currentParticipantData = csvData.filter(
            (entry) => Number(entry["ParticipantID"]) === this.participantID
        );

        for (let trialID of this.logs.keys()) {
            const log = this.logs.get(trialID);
            const trialDataIndex = currentParticipantData.findIndex(
                (trial) => Number(trial["TrialID"]) === trialID
            );

            currentParticipantData[trialDataIndex]["Duration"] = log.duration.toFixed(0);
            currentParticipantData[trialDataIndex]["NbErrors"] = log.nbErrors.toFixed(0);
        }

        return Papa.unparse(currentParticipantData);
    }

    saveIntoLocalStorage(): void {
        const savedLogsJSON = localStorage.getItem(Logger.LOCAL_STORAGE_KEY);
        const savedLogs = savedLogsJSON !== null
                           ? JSON.parse(savedLogsJSON)
                           : {};
        
        savedLogs[this.participantID] = [...this.logs.values()];

        localStorage.setItem(Logger.LOCAL_STORAGE_KEY, JSON.stringify(savedLogs));
    }
}