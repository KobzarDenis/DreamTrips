import { State, StateName } from "./State";
import {MoodState, User} from "../User";
import { IncomingMessage } from "@core/bots/Bot";
import { EntryState } from "./Entry.state";
import { Button } from "@core/bots/Bot";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Configurator } from "@core/bots/Configurator";
import { Options } from "../decorators";
import {Redis} from "@core/Redis";

@Options(StateName.ContactCollection)
export class ContactCollectionState extends State {

    private static _instance: State;

    private constructor() {
        super();
    }

    public static getInstance(): State {
        if (!ContactCollectionState._instance) {
            ContactCollectionState._instance = new ContactCollectionState();
        }

        return ContactCollectionState._instance;
    }

    protected async do(user: User, data: IncomingMessage, additional?: any): Promise<void> {
        let additionalInfo = {contactType: data.command.substring(1)};

        await user.bot.sendMessage(user.botId, `Please type your contact bellow...`);
        await super.changeState(user, this, Redis.WEEK_TTL, additionalInfo);
    }

    protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
        const isUpdated = await user.updateContacts(data.original, additional.contactType);

        if(isUpdated) {
            // await ManualInviteModel.create({userId: user.id, date: new Date()});
            // ToDo: Create table for manual invites
            await user.bot.sendMessage(user.botId, `Спасибо, мы свяжемся с тобой в ближайшее время =)\nА пока предлагаем подписаться на наши страницы в соц. сетях !`);
            await user.bot.sendSocialLinks(user.botId);
        } else {
            await user.bot.sendMessage(user.botId, `Ошибка при обновлении данных.`);
        }
    }

}
