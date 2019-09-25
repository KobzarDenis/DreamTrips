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
  ContactCollection = 'contactCollection'
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
   * Process user's text message in current state context
   * @param {User} user - instance of user
   */
  public async processText(user: User, data: IncomingMessage): Promise<void> {
    await this.reply(user, data);
  }

  /**
   * Reply for user's text message in current state context
   * @param {User} user - instance of user
   * @param {IncomingMessage} data - incoming message
   * @return {Promise<void>}
   */
  protected async abstract reply(user: User, data: IncomingMessage): Promise<void>;

  /**
   * Do action on current state
   * @param {User} user - instance of user
   * @param {IncomingMessage} data - incoming message
   * @return {Promise<void>}
   */
  protected async abstract do(user: User, data: IncomingMessage): Promise<void>;

  /**
   * Change user's state in Redis after the action
   * @param {User} user - instance of user
   * @param {State} newState - instance of state
   */
  protected async changeState(user: User, newState: State, ttl: number = Redis.WEEK_TTL): Promise<void> {
    user.setState(newState);
    await Redis.getInstance().setItem(`${user.botSource}__${user.botId}`, user.pack(), ttl);
  }

}
