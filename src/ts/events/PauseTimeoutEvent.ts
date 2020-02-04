import { Event } from './EventManager';

/** A class for an event when the tape position changed. */
export class SetupCompletion implements Event {
  id: string = "setupCompletion";
}