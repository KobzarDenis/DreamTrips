import * as TelegramAPI from "node-telegram-bot-api";
import {Button, IncomingMessage} from "@core/bots/Bot";
import {Command} from "@core/bots/Configurator";
import {EventEmitter} from "events";
import {Redis} from "@core/Redis";
import {AdminModel} from "@core/models/admin.model";
import {Logger} from "@core/Logger";
import {message} from "aws-sdk/clients/sns";

//ToDo: finish it
export class SystemBot extends EventEmitter {
    private bot: TelegramAPI;
    private admins: Map<string, AdminModel>;
    public static _instance: SystemBot;

    private constructor(token: string) {
        super();
        this.bot = new TelegramAPI(token, {polling: true});
    }

    public static getInstance(token?: string): SystemBot {
        if (!SystemBot._instance) {
            if (!token) {
                throw new Error(`Missing params`);
            }

            SystemBot._instance = new SystemBot(token);
        }

        return SystemBot._instance;
    }

    public init() {
        this.bot.on('message', async (msg) => {
            const parsedMessage: IncomingMessage = this.parseMessage(msg);
            await this.onMessage(parsedMessage);
        });
        this.bot.on('callback_query', async (msg) => {
            const parsedMessage: IncomingMessage = this.parseMessage(msg);
            await this.onCallback(parsedMessage);
        });
        this.on(Command.Subscribe, this.subscribe.bind(this));
        this.on(Command.Start, this.start.bind(this));
        this.on(Command.Help, this.help.bind(this));
        this.on(Command.RemindMe, this.remindMe.bind(this));
        this.on(Command.Setup, this.setup.bind(this));
    }

    public async loadAdmins(): Promise<void> {
        const adminArr = await AdminModel.findAll();
        adminArr.forEach(admin => {
            if (admin.botId) {
                Logger.getInstance().info(`Admin signed in : [email: ${admin.email}, botId: ${admin.botId}]`);
                this.admins.set(admin.botId, admin);
            }
        });
    }

    private async onMessage(message: IncomingMessage) {
        const admin = this.admins.get(<string> message.chatId);
        if(!admin) {
            const $admin = <AdminModel> await AdminModel.findOne({where: {uuid: message.payload[0]}});
            if(!$admin) {
                this.sendAuth(message);
            }

            $admin.botId = <string> message.chatId;
            await $admin.save();

            this.admins.set(<string> message.chatId, $admin);
            this.sendMessage(<string> message.chatId, 'Вы успешно вошли в аккаунт!');
        }

        this.emit(message.command, message, admin);
    }

    private async onCallback(message: IncomingMessage) {

    }

    public async sendAuth(message: IncomingMessage) {
        this.sendMessage(<string> message.chatId, `Введите Ваш uuid для авторизации.`);
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

            options.reply_markup = JSON.stringify({inline_keyboard, hide_keyboard: true});

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
        const original = msg.text ? msg.text.trim() : msg.data.trim();
        const parsed = original.split(':');
        const commandAndId = parsed[0].split(' ');

        const chat = msg.chat || msg.message.chat;

        let message: IncomingMessage = {
            original,
            chat: {
                id: chat.id,
                source: "system",
                firstName: chat.first_name,
                lastName: chat.last_name
            },
            command: commandAndId[0].trim(),
            userId: commandAndId.length > 1 ? commandAndId[1].trim() : null,
            payload: parsed[1] ? parsed[1].split('_').map(val => val.trim()) : null
        };

        return message;
    }

    private async start(message: IncomingMessage, admin: AdminModel) {
        await this.sendAuth(message);
    }

    private async help(message: IncomingMessage, admin: AdminModel) {

    }

    private async subscribe(message: IncomingMessage, admin: AdminModel) {

    }

    private async remindMe(message: IncomingMessage, admin: AdminModel) {

    }

    private async setup(message: IncomingMessage) {
        const admin = this.admins.get(<string> message.chatId);
        if(!admin) {
            await Redis.getInstance().setItem(this.getKey(<string> message.chatId), null);
        }
    }

    public async broadcast(message: string): Promise<void> {
        this.admins.forEach(admin => {
            this.sendMessage(admin.botId, message);
        });
    }

    private getKey(botId: string): string {
        return `admin_${botId}`;
    }
}
