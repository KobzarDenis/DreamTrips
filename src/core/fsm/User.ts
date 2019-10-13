import {State, StateName, GreetingState} from "./states";
import {Bot} from "../bots";
import {Langs} from "@core/bots/translator";
import {IncomingMessage} from "@core/bots/Bot";
import {UserModel} from "@core/models/user.model";
import {UserStateModel} from "@core/models/userState.model";
import {validator} from "@core/validators";
import {ValidationError} from "@core/errors";
import { Logger } from "@core/Logger";

export enum MoodState {
    UNKNOWN = 'unknown',
    AGREE = 'agree',
    UNCERTAINTY = 'uncertainty',
    BLOCK = 'block',
    DISCARD = 'discard'
}

export enum ContactType {
    PhoneNumber = 'phone-number',
    Email = 'email'
}

export class User {

    public id: number;
    public name: string;
    public lang: Langs;
    public bot: Bot;
    public readonly botId: string;
    public readonly botSource: string;
    private _currentState: State;
    private _currentStateName: StateName;
    private _moodState: MoodState;

    constructor(id, name, lang, bot: Bot, botSource: string, botId: string, state?: State) {
        this.id = id;
        this.name = name;
        this.lang = lang;
        this.bot = bot;
        this.botSource = botSource;
        this.botId = botId;
        this._currentState = state ? state : GreetingState.getInstance();
        this._currentStateName = this._currentState.name;
    }

    public setState(state: State): void {
        if (!state) {
            throw new Error(`Incorrect state!`);
        }

        this._currentState = state;
        this._currentStateName = state.name;
    }

    public async updateStateAndMood(state: string, mood: MoodState): Promise<boolean> {
        try {
            await UserStateModel.update({state, mood}, {where: {userId: this.id}});
            return true;
        } catch (e) {
            Logger.getInstance().error(`Cannot update user's contacts: userId - [${this.id}], error - [${e.message}]`);
            return false;
        }
    }

    public async updateContacts(contactData: string, type: ContactType): Promise<boolean> {
        let contactInfo;
        if (type === ContactType.PhoneNumber) {
            contactInfo = {
                phoneNumber: contactData
            };
        } else {
            contactInfo = {
              email: contactData
            };
        }

        try {
            if(!validator(contactInfo, type)) {
                throw new ValidationError(validator["errors"]);
            }

            await UserModel.update({...contactInfo}, {where: {id: this.id}});
            return true;
        } catch (e) {
            Logger.getInstance().error(`[UPDATE USER CONTACTS] ${e.message}`);
            return false;
        }
    }

    public async handleAction(data: IncomingMessage, additional?: any): Promise<void> {
        try {
            await this._currentState.handleAction(this, data, additional);
        } catch (e) {
            Logger.getInstance().error(`[handleAction]: ${e.message}`);
        }
    }

    public async processText(data: IncomingMessage, additional?: any): Promise<void> {
        try {
            await this._currentState.processText(this, data, additional);
        } catch (e) {
            Logger.getInstance().error(`[processText]: ${e.message}`);
        }
    }

    /**
     * Send message to user's messenger
     * @param {string} message - text message
     */
    public async sendMessage(message: string): Promise<void> {
        try {
            await this.bot.sendMessage(this.botId, message);
        } catch (e) {
            Logger.getInstance().error(`[sendMessage]: ${e.message}`);
        }
    }

    /**
     * Pack user's data to set into temp storage
     */
    public pack(additional: any): string {
        const dto = {
            id: this.id,
            name: this.name,
            mood: this._moodState,
            lang: this.lang,
            botSource: this.botSource,
            botId: this.botId,
            currentStateName: this._currentStateName,
            additional
        };

        return JSON.stringify(dto);
    }

}
