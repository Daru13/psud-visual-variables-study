import { Event } from './EventManager';

export class PauseTimeoutEvent implements Event {
  static readonly id = "pauseTimeout";
  readonly id = PauseTimeoutEvent.id;
}