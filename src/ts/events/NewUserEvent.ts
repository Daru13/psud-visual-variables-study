import { Event } from './EventManager';

/** A class for an event when the tape position changed. */
export class NewUserEvent implements Event {
  id: string = "newUser";
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }
}