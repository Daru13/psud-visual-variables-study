import { Event } from './EventManager';

/** A class for an event when the tape position changed. */
export class PauseEndEvent implements Event {
  id: string = "pauseEndUser";
}