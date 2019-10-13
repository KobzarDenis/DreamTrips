import {State, StateName} from "./State";
import {User} from "../User";
import {IncomingMessage} from "@core/bots/Bot";
import {Options} from "../decorators";
import {Redis} from "@core/Redis";
import {PendingUserModel} from "@core/models/pendingUser.model";
import {Phrases, Translator} from "@core/bots/translator";

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

        await user.bot.sendMessage(user.botId, Translator.getMessage(user.lang, Phrases.TYPE_CONTACT));
        await super.changeState(user, this, Redis.WEEK_TTL, additionalInfo);
    }

    protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
        const isUpdated = await user.updateContacts(data.original, additional.contactType);

        if(isUpdated) {
            await PendingUserModel.create({userId: user.id, type:additional.contactType});
            //ToDo: Send to system bot info
            await user.bot.sendMessage(user.botId, Translator.getMessage(user.lang, Phrases.CONTACTS_UPDATE_SUCCESS));
            await user.bot.sendSocialLinks(user.botId);
        } else {
            await user.bot.sendMessage(user.botId, Translator.getMessage(user.lang, Phrases.CONTACTS_UPDATE_ERROR));
        }
    }

}
