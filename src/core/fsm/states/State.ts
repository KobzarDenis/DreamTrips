import { User } from "../User";
import { IncomingMessage } from "@core/bots/Bot";
import { Redis } from "@core/Redis";

export enum StateName {
  Greeting = 'greeting',
  Entry = 'entry',
  AttractionFirst = 'attractionFirst',
  AttractionSecond = 'attractionSecond',
  Intro = 'intro',
  WhoWeAre = 'whoWeAre',
  Presentation = 'presentation',
  ChoseVariant = 'choseVariant',
  Objections = 'objections',
  Invitation = 'invitation',
  Acception = 'acception',
  ManualInvite = "manualInvite",
  Finish = 'finish',
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
  protected async changeState(user: User, newState: State, ttl: number = Redis.WEEK_TTL): Promise<void> {
    user.setState(newState);
    await Redis.getInstance().setItem(`${user.botSource}__${user.botId}`, user.pack(), ttl);
  }

}
