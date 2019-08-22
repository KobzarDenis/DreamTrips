import * as TelegramAPI from "node-telegram-bot-api";
import { Bot, IncomingMessage, Button } from "@core/bots/Bot";
import { Command, Configurator } from "@core/bots/Configurator";
import { Buttons, Phrases, Translator } from "./translator";
import { StateBuilder, StateHolder } from "@core/fsm";

export class TelegramBot extends Bot {

  public readonly source: string;

  private bot: TelegramAPI;
  public static _instance: TelegramBot;

  private constructor(token: string) {
    super();
    this.bot = new TelegramAPI(token, { polling: true });
    this.source = "telegram";
  }

  public static getInstance(token?: string): TelegramBot {
    if (!TelegramBot._instance) {
      if (!token) {
        throw new Error(`Missing params`);
      }

      TelegramBot._instance = new TelegramBot(token);
    }

    return TelegramBot._instance;
  }


  public init() {
    this.bot.on('message', this.onMessage.bind(this));
    this.bot.on('callback_query', this.onCallBack.bind(this));
    this.on(Command.Subscribe, this.subscribe.bind(this));
    this.on(Command.Start, this.start.bind(this));
    this.on(Command.Help, this.help.bind(this));
    this.on(Command.RemindMe, this.remindMe.bind(this));
    this.on(Command.Setup, this.setup.bind(this));
  }

  public buttonsBuilder(template: Button | Button[]) {
    if (template) {
      const options = {
        reply_markup: "{}",
        resize_keyboard: true,
        one_time_keyboard: true
      };

      const inline_keyboard: any[] = [];

      if (Array.isArray(template)) {
        template.forEach(b => {
          inline_keyboard.push([{
            text: b.text,
            callback_data: b.value
          }]);
        })
      } else {
        inline_keyboard.push([{
          text: template.text,
          callback_data: template.value
        }]);
      }

      options.reply_markup = JSON.stringify({ inline_keyboard });

      return options;
    }
  }

  public async sendMessage(chatId: string | number, message: string, buttons?: Button | Button[]): Promise<number> {
    let msgId: number;

    if (buttons) {
      const options = this.buttonsBuilder(buttons);
      msgId = await this.bot.sendMessage(chatId, message, options);
    } else {
      msgId = await this.bot.sendMessage(chatId, message);
    }

    return msgId;
  }

  private async onMessage(msg: any) {
    const message = this.parseMessage(msg);
    console.log(`TELEGRAM Bot new message [chatId: ${message.chat.id}; name: ${message.chat.first_name} ${message.chat.last_name}]`);
    console.log(`TELEGRAM Bot new message [command: ${message.command}; payload: ${JSON.stringify(message.payload)}]`);
    this.emit(message.command, message);
  }

  private async onCallBack(msg: any) {
    const message = this.parseMessage(msg);
    console.log(`TELEGRAM Bot new callback: ${message}`);
    if (message.command == Command.Setup) {
      await this.setup(message);
    } else {
      const user = StateHolder.getUser(`${this.source}__${message.chat.id}`);
      await user.handleAction(message);
    }
  }

  private parseMessage(msg: any): IncomingMessage {
    const parsed = msg.text ? msg.text.split(':') : msg.data.split(':');
    const commandAndId = parsed[0].split(' ');

    let message: IncomingMessage = {
      chat: msg.chat || msg.message.chat,
      command: commandAndId[0].trim(),
      userId: commandAndId.length > 1 ? commandAndId[1].trim() : null,
      payload: parsed[1] ? parsed[1].split('_').map(val => val.trim()) : null
    };

    return message;
  }

  public async subscribe(data: IncomingMessage) {
    await this.bot.sendMessage(data.chat.id, `${data.chat.first_name}, Вы можете поднять дохуя бабла.`);
  }

  public async start(data: IncomingMessage) {
    const message = `Выберите язык: `;
    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Русский 🇷🇺', callback_data: `${Command.Setup}:ru_${data.userId || 0}` }],
          [{ text: 'Українська 🇺🇦', callback_data: `${Command.Setup}:ua_${data.userId || 0}` }]
        ]
      })
    };

    this.bot.sendMessage(data.chat.id, message, options);
  }

  public async remindMe(data: IncomingMessage) {
    const message = `Ok, ${data.chat.first_name}. I'm gonna remind you about next meting`;

    await this.bot.sendMessage(data.chat.id, message);
  }

  public async setup(data: IncomingMessage) {
    await StateBuilder.setup(data.chat.first_name, data.chat.last_name, data.payload[0], this, this.source, data.chat.id, data.payload[1]);
  }

  public async help(data: IncomingMessage) {
    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Как это работает ?', callback_data: Command.Help }],
          [{ text: 'Что я могу с этим делать ?', callback_data: Command.Subscribe }],
        ]
      })
    };

    this.bot.sendMessage(data.chat.id, 'Выберите Ваш вопрос:', options);
  }
}
