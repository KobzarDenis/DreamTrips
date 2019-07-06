import { EventEmitter } from "events";

export enum Command {
  Start = '/start',
  Help = '/help',
  Subscribe = '/subscribe'
}

export type Message = {
  chatId: string,
  command: Command,
  payload: any
};

export abstract class Bot extends EventEmitter {

  public handleRequest(command: Command, userId) {
    console.log(`Income command - ${command}, from user - ${userId}`);
  }

}
