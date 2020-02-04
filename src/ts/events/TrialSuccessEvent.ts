import { Event } from './EventManager';

export class TrialSuccessEvent implements Event {
    static readonly id = "trialSuccess";
    readonly id = TrialSuccessEvent.id;

    readonly duration: number;
    readonly errorCount: number;

    constructor(duration: number, errorCount: number) {
        this.duration = duration;
        this.errorCount = errorCount;
    }
}