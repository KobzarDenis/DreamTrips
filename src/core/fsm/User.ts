import { State } from "./State";
import { GreetingState } from "./Greeting.state";
import { Bot } from "../bots";

export class User {

  get state(): State {
    return this._currentState;
  };

  get bot(): Bot {
    return this._bot;
  };

  public name: string;
  public email: string;
  private _bot: Bot;
  private _currentState: State;

  constructor(bot: Bot, state: State) {
    this._bot = bot;
    this._currentState = state ? state : new GreetingState();
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

  /**
   * Send message to user's messenger
   * @param {string} message - text message
   */
  public async sendMessage(message: string): Promise<void> {
    await this._bot.sendText(message);
  }

  /**
   * Pack user's data for set in to temp DB
   */
  public pack(): string {
    return "";
  }

}
