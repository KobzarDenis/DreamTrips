import { State, StateName, GreetingState } from "./states";
import { Bot } from "../bots";
import { Langs } from "@core/bots/translator";
import { IncomingMessage } from "@core/bots/Bot";

//ToDo: Create type file with bot types, message types
export class User {

  public id: number;
  public name: string;
  public lang: Langs;
  public readonly bot: Bot;
  public readonly botId: string;
  public readonly botSource: string;
  public readonly currentStateName: StateName;

  private _currentState: State;

  constructor(id, name, lang, bot: Bot, botSource: string, botId: string, state?: State) {
    this.id = id;
    this.name = name;
    this.lang = lang;
    this.bot = bot;
    this.botSource = botSource;
    this.botId = botId;
    this._currentState = state ? state : GreetingState.getInstance();
  }

  /**
   * Change user's state
   * @param {State} state - state instance
   */
  public setState(state: State): void {
    if (!state) {
      throw new Error(`Incorrect state!`);
    }

    this._currentState = state;
  }

  public async handleAction(data: IncomingMessage) {
    try {
      await this._currentState.handleAction(this, data);
    } catch (e) {
      console.log(`ERROR [handleAction]: ${e.message}`);
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
      console.log(`ERROR [sendMessage]: ${e.message}`);
    }
  }

  /**
   * Pack user's data for set in to temp DB
   */
  public pack(): string {
    const dto = {
      name: this.name,
      lang: this.lang,
      botSource: this.botSource,
      botId: this.botId,
      currentStateName: this.currentStateName
    };

    return JSON.stringify(dto);
  }

}
