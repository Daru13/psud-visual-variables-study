import { Event } from './EventManager';
import { ParticipantID } from '../Session';

export class SetupCompletionEvent implements Event {
  static readonly id = "setupCompletion";
  readonly id = SetupCompletionEvent.id;

  readonly participantID: ParticipantID;

  constructor(participantID: ParticipantID) {
    this.participantID = participantID;
  }
}