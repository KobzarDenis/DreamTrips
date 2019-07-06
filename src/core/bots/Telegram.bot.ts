import * as TelegramAPI from "node-telegram-bot-api";
import {Bot, Command, Message} from "@core/bots/Bot";

export class TelegramBot extends Bot {

  private bot: TelegramAPI;
  
  constructor(token: string) {
    super();
    //this.chats = null;
    this.bot = new TelegramAPI(token, { polling: true });
  }

  public init() {
    this.bot.on('message', this.onMessage.bind(this));
    this.bot.on('callback_query', this.onMessage.bind(this));
    this.on(Command.Subscribe, this.subscribe.bind(this));
    this.on(Command.Start, this.start.bind(this));
    this.on(Command.Help, this.help.bind(this));
  }

  private async onMessage(msg) {
    const parsed = msg.text ? msg.text.split(':') : msg.data.split(':');
    const payload = parsed[1] ? parsed[1].split(' ').map(val => val.trim()) : null;
    const chatId = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

    const data: Message = {
      chatId,
      command: parsed[0].trim(),
      payload //separated by "_" different command in each element
    };

    console.log(`TELEGRAM Bot new message: ${data}`);

    this.emit(data.command, data);
  }

  public async subscribe(data: Message) {
    await this.bot.sendMessage(data.chatId, `${data.chatId}, Вы можете поднять дохуя бабла.`);
  }

  public async start(data: Message) {
    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{text: 'Хочу детали', callback_data: Command.Help}],
          [{text: 'Подписаться', callback_data: Command.Subscribe}],
          [{text: 'Помощь', callback_data: Command.Help}],
          [{text: 'Обратный звонок', callback_data: Command.Subscribe}]
        ]
      })
    };

    const res = await this.bot.sendMessage(data.chatId, 'Выберите вариант:', options);
    console.log(res);
  }

  public async help(data: Message) {
    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{text: 'Как это работает ?', callback_data: Command.Help}],
          [{text: 'Что я могу с этим делать ?', callback_data: Command.Subscribe}],
        ]
      })
    };

    this.bot.sendMessage(data.chatId, 'Выберите Ваш вопрос:', options);
  }
}
