import { EventEmitter } from "events";


export type IncomingMessage = {
  command: string,
  payload: any,
  chatId?: string,
  chat?: any,
  userId: string
};

export enum BotName {
  Telegram = 'telegram',
  Facebook = 'facebook'
}

export type Button = {
  text: string;
  value: string;
};

export abstract class Bot extends EventEmitter {

  public static readonly SHORT_PAUSE_MS = 800;
  public static readonly MID_PAUSE_MS = 1500;
  public static readonly LONG_PAUSE_MS = 3000;

  public source: string;

  public handleRequest(command: string, userId) {
    console.log(`Income command - ${command}, from user - ${userId}`);
  }

  protected abstract buttonsBuilder(template: Button | Button[]);
  public abstract async sendMessage(chatId: string | number, message: string, buttons?: Button | Button[]): Promise<number>;

}
