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

  /**
   *
   * @param {string} message - text message for user
   * @return {Promise<void>}
   */
  public async sendText(message: string): Promise<void> {
    console.log(message);
  }

  public async sendGreeting(name: string): Promise<void> {

  }

}
