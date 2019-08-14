import { Bot, IncomingMessage } from "@core/bots/Bot";
import { Configurator, Command } from "@core/bots/Configurator";
import { FacebookMessagingAPIClient, BUTTON_TYPE } from "fb-messenger-bot-api";
import { ExpressServer } from "@core/servers/Express.server";
import * as appconfig from "../../../appconfig";

export class FacebookBot extends Bot {

  private bot: FacebookMessagingAPIClient;

  constructor(token: string, server: ExpressServer) {
    super();
    //this.chats = null;
    this.bot = new FacebookMessagingAPIClient(token);
    this.createHandler(server);
  }

  public init() {
    this.on(Command.Subscribe, this.subscribe.bind(this));
    this.on(Command.Start, this.start.bind(this));
    this.on(Command.Help, this.help.bind(this));
  }

  private async onMessage(msg) {
    const parsed = msg.data.split(':');
    const payload = parsed[1] ? parsed[1].split(' ').map(val => val.trim()) : null;
    const chatId = msg.senderId

    const data: IncomingMessage = {
      chatId,
      command: parsed[0].trim(),
      payload //separated by "_" different command in each element
    };

    console.log(`FB Bot new message: ${data}`);

    this.emit(data.command, data);
  }

  public async subscribe(data: IncomingMessage) {
    await this.bot.sendTextMessage(data.chatId, `${data.chatId}, Вы можете поднять дохуя бабла.`);
  }

  public async start(data: IncomingMessage) {
    const buttons = [
      { type: BUTTON_TYPE.POSTBACK, title: 'Хочу детали', payload: Command.Help },
      { type: BUTTON_TYPE.POSTBACK, title: 'Подписаться', payload: Command.Subscribe }
    ];

    this.bot.sendButtonsMessage(data.chatId, 'Выберите вариант:', buttons);
  }

  public async help(data: IncomingMessage) {
    const buttons = [
      { type: BUTTON_TYPE.POSTBACK, title: 'Как это работает ?', payload: Command.Help },
      { type: BUTTON_TYPE.POSTBACK, title: 'Что я могу с этим делать ?', payload: Command.Subscribe }
    ];

    this.bot.sendButtonsMessage(data.chatId, 'Выберите Ваш вопрос:', buttons);
  }

  private createHandler(server: ExpressServer) {
    server.createAdditionalHandlers("get", '/api/webhook', (req, res) => {
      let mode = req.query['hub.mode'];
      let token = req.query['hub.verify_token'];
      let challenge = req.query['hub.challenge'];

      if (mode && token) {
        if (mode === 'subscribe' && appconfig.bot.facebook.verifyToken === token) {
          res.status(200).send(challenge);
        } else {
          res.sendStatus(403);
        }
      }
    });

    server.createAdditionalHandlers("post", '/api/webhook', (req, res) => {
      let body = req.body;

      try {
        if (body.object === 'page') {

          body.entry.forEach((entry) => {
            let event = entry.messaging[0];

            if (event.message) {
              const msg = {
                senderId: event.sender.id,
                data: event.message.text
              };
              this.onMessage(msg);
            } else if (event.postback) {
              const msg = {
                senderId: event.sender.id,
                data: event.postback.payload
              };
              this.onMessage(msg);
            }

          });

          res.status(200).send('EVENT_RECEIVED');

        } else {
          res.sendStatus(404);
        }
      } catch (e) {
        console.log(e.message);
      }

    });
  }

}
