import { Event } from './EventManager';

/** A class for an event when the tape position changed. */
export class SuccesEvent implements Event {
  id: string = "succes";
  duration: number;

  constructor(duration: number) {
      this.duration = duration;
  }
}