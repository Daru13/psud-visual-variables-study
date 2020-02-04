import * as Papa from "papaparse";
import { TrialTable, CSVDataRow, CSVData } from './TrialTable';
import { TrialID } from './Trial';

interface Log {
    trialID: TrialID;
    duration: number;
    nbErrors: number;
}

export class Logger {
    private trialTable: TrialTable;
    private logs: Map<TrialID, Log>;

    constructor(trialTable: TrialTable) {
        this.trialTable = trialTable;
        this.logs = new Map();
    }

    log(log: Log): void {
        this.logs.set(log.trialID, log);
    }

    toCSV(): string {
        const csvData = JSON.parse(JSON.stringify(this.trialTable.sourceCSVData)) as CSVData;

        for (let id of this.logs.keys()) {
            const log = this.logs.get(id);

            const csvTrialData = csvData.find((trial) => Number(trial["ParticipantID"]) === id);
            csvTrialData["Duration"] = log.duration.toFixed(0);
            csvTrialData["NbErrors"] = log.nbErrors.toFixed(0);
        }

        return Papa.unparse(csvData);
    }
}