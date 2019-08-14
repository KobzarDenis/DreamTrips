import * as TelegramAPI from "node-telegram-bot-api";
import { Bot, IncomingMessage } from "@core/bots/Bot";
import { Command, Configurator } from "@core/bots/Configurator";
import { Buttons, Langs, Phrases, Translator } from "./translator";
import { StateBuilder, StateHolder } from "@core/fsm";

export class TelegramBot extends Bot {

  private bot: TelegramAPI;
  private readonly source: string;

  constructor(token: string) {
    super();
    this.bot = new TelegramAPI(token, { polling: true });
    this.source = "telegram";
  }

  public init() {
    this.bot.on('message', this.onMessage.bind(this));
    this.bot.on('callback_query', this.onMessage.bind(this));
    this.on(Command.Subscribe, this.subscribe.bind(this));
    this.on(Command.Start, this.start.bind(this));
    this.on(Command.Help, this.help.bind(this));
    this.on(Command.RemindMe, this.remindMe.bind(this));
    this.on(Configurator.getButtonValue(Buttons.GOGOGO), this.setup.bind(this));
  }

  private async onMessage(msg: any) {
    const message = this.parseMessage(msg);

    console.log(`TELEGRAM Bot new message: ${message}`);

    this.emit(message.command, message);
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
    const buttonValue = Configurator.getButtonValue(Buttons.GOGOGO);
    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Русский 🇷🇺', callback_data: `${buttonValue}:ru_${data.userId || 0}` }],
          [{ text: 'Українська 🇺🇦', callback_data: `${buttonValue}:ua_${data.userId || 0}` }]
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

  public async sendGreeting(data: IncomingMessage) {
    const user = StateHolder.getUser(`${this.source}__${data.chat.id}`);

    const message = Translator.getMessage(user.lang, Phrases.GREETING, [user.name]);

    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: Translator.getButtonText(user.lang, Buttons.GOGOGO), callback_data: Configurator.getButtonValue(Buttons.GOGOGO) }]
        ]
      }),
      resize_keyboard: true,
      one_time_keyboard: true
    };

    await this.bot.sendMessage(data.chat.id, message, options);
  }

  public async sendFirst(data: IncomingMessage) {
    const user = StateHolder.getUser(`${this.source}__${data.chat.id}`);

    const message1 = Translator.getMessage(user.lang, Phrases.INTRO);
    const message2 = Translator.getMessage(user.lang, Phrases.HOW_OFTEN_DO_YOU_TRAVEL);

    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: Translator.getButtonText(user.lang, Buttons.ONES_PER_YEAR), callback_data: Configurator.getButtonValue(Buttons.ONES_PER_YEAR) }],
          [{ text: Translator.getButtonText(user.lang, Buttons.THREE_TIMES_PER_YEAR), callback_data: Configurator.getButtonValue(Buttons.THREE_TIMES_PER_YEAR) }],
          [{ text: Translator.getButtonText(user.lang, Buttons.MORE_OFTEN), callback_data: Configurator.getButtonValue(Buttons.MORE_OFTEN) }],
          [{ text: Translator.getButtonText(user.lang, Buttons.HAVE_NEVER_TRAVELING), callback_data: Configurator.getButtonValue(Buttons.HAVE_NEVER_TRAVELING) }],
        ]
      }),
      resize_keyboard: true,
      one_time_keyboard: true
    };

    await this.bot.sendMessage(data.chat.id, message1);
    setTimeout(async () => {
      await this.bot.sendMessage(data.chat.id, message2, options);
    }, 500);
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
