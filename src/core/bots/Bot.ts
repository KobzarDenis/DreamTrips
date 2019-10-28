import { EventEmitter } from "events";
import { StateHolder } from "@core/fsm";
import { Command } from "@core/bots/Configurator";
import { Logger } from "../Logger";


export type IncomingMessage = {
  command: string,
  payload: any,
  chatId?: string,
  chat?: any,
  userId: string,
  original: string
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

  public static readonly SHORT_PAUSE_MS = 2 * 1000;
  public static readonly MID_PAUSE_MS = 5 * 1000;
  public static readonly LONG_PAUSE_MS = 15 * 1000;
  public static readonly VIDEO_PAUSE = 5 * 60 * 1000;

  public source: string;

  public async setup(data: IncomingMessage) {
    await StateHolder.setup(data.chat.firstName, data.chat.lastName, data.payload[0], data.chat.source, data.chat.id, data.payload[1]);
  }

  public async handleRequest(chatId: string, message: IncomingMessage) {
    const userMeta = await StateHolder.getUserAndMeta(`${this.source}:${chatId}`);
    Logger.getInstance().info(`NEW EVENT [${message.chat.source}] { action: ${message.command}, chatId: ${message.chat.id}, name: ${userMeta.user.name}}`);

    await userMeta.user.handleAction(message, userMeta.additional);
  }

  private async processText(chatId: string, message: IncomingMessage) {
    const userMeta = await StateHolder.getUserAndMeta(`${this.source}:${chatId}`);
    Logger.getInstance().info(`NEW TEXT [${message.chat.source}] { chatId: ${message.chat.id}, name: ${userMeta.user.name}, text: ${message.original}}`);

    await userMeta.user.processText(message, userMeta.additional);
  }

  protected checkCommand(command: string): boolean {
    if(!this.eventNames().find((n => n === command))) {
      return false;
    }
    return true;
  }

  protected async onMessage(message: IncomingMessage) {
    Logger.getInstance().info(`[${message.chat.source}] Bot new message [chatId: ${message.chat.id}; name: ${message.chat.firstName} ${message.chat.lastName}]`);
    Logger.getInstance().info(`[${message.chat.source}] Bot new message [command: ${message.command}; payload: ${JSON.stringify(message.payload)}]`);

    if(this.checkCommand(message.command)) {
      this.emit(message.command, message);
    } else {
      this.processText(message.chat.id, message);
    }
  }

  protected async onCallBack(message: IncomingMessage) {
    if (message.command == Command.Setup) {
      await this.setup(message);
    } else {
      await this.handleRequest(message.chat.id, message);
    }
  }

  protected abstract parseMessage(msg: any): IncomingMessage;

  public abstract async typingOn(chatId: string);
  public abstract async typingOff(chatId: string);
  public abstract async sendSocialLinks(chatId: string);
  public abstract async sendVideo(chatId: string, key: string);

  protected abstract buttonsBuilder(template: Button | Button[]);

  public abstract async sendMessage(chatId: string | number, message: string, buttons?: Button | Button[]): Promise<number>;

}
