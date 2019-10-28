import { User } from "../User";
import { IncomingMessage } from "@core/bots/Bot";
import { Redis } from "@core/Redis";
import {Phrases, Translator} from "@core/bots/translator";
import {SystemBot} from "@core/bots";

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
  public name: StateName;

  protected constructor() {

  }

  /**
   * Handle user's action from one state to another
   * @param {User} user - instance of user
   */
  public async handleAction(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    await this.do(user, data, additional);
  }

  /**
   * Process user's text message in current state context
   * @param {User} user - instance of user
   */
  public async processText(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    await this.reply(user, data, additional);
  }

  /**
   * Reply for user's text message in current state context
   * @param {User} user - instance of user
   * @param {IncomingMessage} data - incoming message
   * @return {Promise<void>}
   */
  protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    const message = Translator.getMessage(user.lang, Phrases.COMMON_REPLY);
    await user.bot.sendMessage(user.botId, message);
  };

  /**
   * Do action on current state
   * @param {User} user - instance of user
   * @param {IncomingMessage} data - incoming message
   * @return {Promise<void>}
   */
  protected async abstract do(user: User, data: IncomingMessage, additional?: any): Promise<void>;

  /**
   * Change user's state in Redis after the action
   * @param {User} user - instance of user
   * @param {State} newState - instance of state
   */
  protected async changeState(user: User, newState: State, ttl: number = Redis.WEEK_TTL, additional?: any): Promise<void> {
    user.setState(newState);
    await Redis.getInstance().setItem(`${user.botSource}__${user.botId}`, user.pack(additional), ttl);
  }

}
