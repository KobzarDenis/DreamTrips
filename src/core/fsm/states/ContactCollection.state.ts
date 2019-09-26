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
        let additionalInfo;
        switch (data.command) {
            case Configurator.getButtonValue(Buttons.EMAIL):
                additionalInfo = {contactType: Configurator.getButtonValue(Buttons.EMAIL)};
                await user.updateMood(MoodState.AGREE);
                break;
            case Configurator.getButtonValue(Buttons.PHONE_NUMBER):
                additionalInfo = {contactType: Configurator.getButtonValue(Buttons.PHONE_NUMBER)};
                await user.updateMood(MoodState.AGREE);
                break;
            default:
                additionalInfo = null;
                break;
        }

        await user.bot.sendMessage(user.botId, `Please type your contact bellow...`);
        await super.changeState(user, this, Redis.WEEK_TTL, additionalInfo);
    }

    protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
        await user.bot.sendMessage(user.botId, `This is your ${additional.contactType}  [${data.original}].`);
    }

}
