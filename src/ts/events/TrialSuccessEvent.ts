import { Event } from './EventManager';

export class TrialSuccessEvent implements Event {
  static readonly id = "trialSuccess";
  readonly id = TrialSuccessEvent.id;

  readonly duration: number;

  constructor(duration: number) {
      this.duration = duration;
  }
}