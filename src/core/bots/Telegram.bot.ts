import * as TelegramAPI from "node-telegram-bot-api";
import { Bot, IncomingMessage, Button, BotName } from "@core/bots/Bot";
import { Command } from "@core/bots/Configurator";
import * as appconfig from "../../../appconfig";

export class TelegramBot extends Bot {

  public readonly source: BotName;

  private bot: TelegramAPI;
  public static _instance: TelegramBot;

  private constructor(token: string) {
    super();
    this.bot = new TelegramAPI(token, { polling: true });
    this.source = BotName.Telegram;
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
    this.bot.on('message', async (msg) => {
      const parsedMessage: IncomingMessage = this.parseMessage(msg);
      await super.onMessage(parsedMessage);
    });
    this.bot.on('callback_query', async (msg) => {
      const parsedMessage: IncomingMessage = this.parseMessage(msg);
      await super.onCallBack(parsedMessage);
    });
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

  protected parseMessage(msg: any): IncomingMessage {
    const parsed = msg.text ? msg.text.split(':') : msg.data.split(':');
    const commandAndId = parsed[0].split(' ');

    const chat = msg.chat || msg.message.chat;

    let message: IncomingMessage = {
      chat: {
        id: chat.id,
        source: this.source,
        firstName: chat.first_name,
        lastName: chat.last_name
      },
      command: commandAndId[0].trim(),
      userId: commandAndId.length > 1 ? commandAndId[1].trim() : null,
      payload: parsed[1] ? parsed[1].split('_').map(val => val.trim()) : null
    };

    return message;
  }

  public async typingOn(chatId: string): Promise<any> {
    await this.bot.sendChatAction(chatId, 'typing');
  }

  public async typingOff(chatId: string): Promise<any> {
    //await this.bot.sendChatAction(chatId, 'typing');
  }

  async sendSocialLinks(chatId: string): Promise<any> {
    const options = {
      reply_markup: JSON.stringify([
        [{
          text: "Telegram",
          url: appconfig.socialLinks.telegram
        }],
        [{
          text: "Facebook",
          url: appconfig.socialLinks.facebook
        }],
        [{
          text: "Instagram",
          url: appconfig.socialLinks.instagram
        }]
      ]),
      resize_keyboard: true,
      one_time_keyboard: true
    };

    this.bot.sendMessage(chatId, "Apply now!", options);
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
