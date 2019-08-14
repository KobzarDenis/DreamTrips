import { EventEmitter } from "events";


export type IncomingMessage = {
  command: string,
  payload: any,
  chatId?: string,
  chat?: any,
  userId: string
};

export abstract class Bot extends EventEmitter {

  public handleRequest(command: string, userId) {
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

  public abstract async sendGreeting(data: IncomingMessage): Promise<void>;
  public abstract async sendFirst(data: IncomingMessage): Promise<void>;

}
