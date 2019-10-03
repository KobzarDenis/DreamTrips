import { Bot, BotName, Button, IncomingMessage } from "@core/bots/Bot";
import { Command } from "@core/bots/Configurator";
import { BUTTON_TYPE, FacebookMessagingAPIClient, IButton } from "fb-messenger-bot-api";
import { ExpressServer } from "@core/servers/Express.server";
import * as appconfig from "../../../appconfig";

export class FacebookBot extends Bot {

  public readonly source: BotName;

  private bot: FacebookMessagingAPIClient;
  public static _instance: FacebookBot;

  constructor(token: string, server: ExpressServer) {
    super();
    this.bot = new FacebookMessagingAPIClient(token);
    this.createHandler(server);
    this.source = BotName.Facebook;
  }

  public init() {
    this.on(Command.Subscribe, this.subscribe.bind(this));
    this.on(Command.Start, this.start.bind(this));
    this.on(Command.Help, this.help.bind(this));
  }

  public static getInstance(token?: string, server?: ExpressServer): FacebookBot {
    if (!FacebookBot._instance) {
      if (!token || !server) {
        throw new Error(`Missing params`);
      }

      FacebookBot._instance = new FacebookBot(token, server);
    }

    return FacebookBot._instance;
  }

  public buttonsBuilder(template: Button | Button[]) {
    if (template) {
      const options: any[] = [];

      if (Array.isArray(template)) {
        template.forEach(b => {
          options.push({
            type: BUTTON_TYPE.POSTBACK,
            title: b.text,
            payload: b.value
          });
        })
      } else {
        options.push({
          type: BUTTON_TYPE.POSTBACK,
          title: template.text,
          payload: template.value
        });
      }

      return options;
    }
  }

  protected parseMessage(msg): IncomingMessage {
    const original = msg.data;
    const parsed = original.split(':');
    const commandAndId = parsed[0].split(' ');

    const message: IncomingMessage = {
      original,
      chat: {
        id: msg.senderId,
        source: this.source,
        firstName: msg.first_name,
        lastName: msg.last_name
      },
      command: commandAndId[0].trim(),
      userId: commandAndId.length > 1 ? commandAndId[1].trim() : null,
      payload: parsed[1] ? parsed[1].split('_').map(val => val.trim()) : null
    };

    return message;
  }

  public async typingOn(chatId: string): Promise<any> {
    await this.bot.toggleTyping(chatId, true);
  }

  public async typingOff(chatId: string): Promise<any> {
    await this.bot.toggleTyping(chatId, false);
  }

  async sendSocialLinks(chatId: string): Promise<any> {
    const buttons = [
      {
        type: BUTTON_TYPE.URL,
        title: "Telegram",
        url: appconfig.socialLinks.telegram
      },
      {
        type: BUTTON_TYPE.URL,
        title: "Facebook",
        url: appconfig.socialLinks.facebook
      },
      {
        type: BUTTON_TYPE.URL,
        title: "Instagram",
        url: appconfig.socialLinks.instagram
      }
    ];

    await this.bot.sendButtonsMessage(chatId, "Apply now!", buttons);
  }

  async sendVideo(chatId: string, key: string): Promise<any> {
    await this.bot.sendVideoMessage(chatId, "https://dreamtrips-team.s3.eu-central-1.amazonaws.com/video/dreamtrips.mp4");
  }

  public async subscribe(data: IncomingMessage) {
    await this.bot.sendTextMessage(data.chat.id, `${data.chat.id}, Вы можете поднять дохуя бабла.`);
  }

  public async start(data: IncomingMessage) {
    const message = `Выберите язык: `;
    const buttons = [
      { type: BUTTON_TYPE.POSTBACK, title: 'Русский 🇷🇺', payload: `${Command.Setup}:ru_${data.userId || 0}` },
      { type: BUTTON_TYPE.POSTBACK, title: 'Українська 🇺🇦', payload: `${Command.Setup}:ua_${data.userId || 0}` }
    ];

    this.bot.sendButtonsMessage(data.chat.id, message, buttons);
  }

  public async sendMessage(chatId: string | number, message: string, buttons?: Button | Button[]): Promise<number> {
    let msgId: number = 0;

    if (buttons) {
      const options = this.buttonsBuilder(buttons);
      await this.bot.sendButtonsMessage(<string> chatId, message, <IButton []> options);
    } else {
      await this.bot.sendTextMessage(<string> chatId, message);
    }

    return msgId;
  }

  public async help(data: IncomingMessage) {
    const buttons = [
      { type: BUTTON_TYPE.POSTBACK, title: 'Как это работает ?', payload: Command.Help },
      { type: BUTTON_TYPE.POSTBACK, title: 'Что я могу с этим делать ?', payload: Command.Subscribe }
    ];

    this.bot.sendButtonsMessage(data.chat.id, 'Выберите Ваш вопрос:', buttons);
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

          body.entry.forEach(async (entry) => {
            let event = entry.messaging[0];

            if (event.message) {

              const profile = <any> await this.bot.getUserProfile(event.sender.id, ["first_name", "last_name"]);

              const msg = {
                senderId: event.sender.id,
                data: event.message.text,
                first_name: profile.first_name,
                last_name: profile.last_name
              };

              const message = this.parseMessage(msg);
              await super.onMessage(message);
            } else if (event.postback) {
              const profile = <any> await this.bot.getUserProfile(event.sender.id, ["first_name", "last_name"]);
              const msg = {
                senderId: event.sender.id,
                data: event.postback.payload,
                first_name: profile.first_name,
                last_name: profile.last_name
              };

              const message = this.parseMessage(msg);
              if(message.command === Command.Start) {
                await super.onMessage(message);
              } else {
                await super.onCallBack(message);
              }
            } else {
              console.log(`UNKNOWN EVENT FROM FB: [${event}]`);
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
