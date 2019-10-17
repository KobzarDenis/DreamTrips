import {State, StateName} from "./State";
import {User} from "../User";
import {IncomingMessage} from "@core/bots/Bot";
import {Options} from "../decorators";
import {Redis} from "@core/Redis";
import {PendingUserModel} from "@core/models/pendingUser.model";
import {Phrases, Translator} from "@core/bots/translator";
import {FinishState} from "@core/fsm/states/Finish.state";

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

        const contactType = additionalInfo.contactType === "email" ? "email" : "телефон";

        await user.bot.sendMessage(user.botId, Translator.getMessage(user.lang, Phrases.TYPE_CONTACT, [contactType]));
        await super.changeState(user, this, Redis.WEEK_TTL, additionalInfo);
    }

    protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
        const isUpdated = await user.updateContacts(data.original, additional.contactType);

        if(isUpdated) {
            await PendingUserModel.create({userId: user.id, type: additional.contactType, state: "not-contacted"});
            //ToDo: Send to system bot info
            await user.bot.sendMessage(user.botId, Translator.getMessage(user.lang, Phrases.CONTACTS_UPDATE_SUCCESS, [user.name]));
            await user.bot.sendSocialLinks(user.botId);
            await super.changeState(user, FinishState.getInstance(), Redis.WEEK_TTL);
        } else {
            await user.bot.sendMessage(user.botId, Translator.getMessage(user.lang, Phrases.CONTACTS_UPDATE_ERROR));
        }
    }

}
