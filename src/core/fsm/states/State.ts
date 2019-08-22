import { User } from "../User";
import { IncomingMessage } from "@core/bots/Bot";

export enum StateName {
  Greeting = 'greeting',
  Entry = 'entry',
  AttractionFirst = 'attractionFirst',
  AttractionSecond = 'attractionSecond',
  Intro = 'intro'
}

export abstract class State {

  protected constructor() {

  }

  /**
   * Handle user's action from one state to another
   * @param {User} user - instance of user
   */
  public async handleAction(user: User, data: IncomingMessage): Promise<void> {
    await this.do(user, data);
  }

  /**
   * Do action on current state
   * @param {User} user - instance of user
   * @return {Promise<void>}
   */
  protected async abstract do(user: User, data: IncomingMessage): Promise<void>;

  /**
   * Change user's state after action
   * @param {User} user - instance of user
   * @param {State} newState - instance of state
   */
  protected changeState(user: User, newState: State): void {
    user.setState(newState);
  }

}
