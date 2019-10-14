import {State, StateName} from "./State";
import {User} from "../User";
import {IncomingMessage} from "@core/bots/Bot";
import {Options} from "../decorators";
import {Phrases, Translator} from "@core/bots/translator";

@Options(StateName.Finish)
export class FinishState extends State {

  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!FinishState._instance) {
      FinishState._instance = new FinishState();
    }

    return FinishState._instance;
  }

  protected async do(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    const message = Translator.getMessage(user.lang, Phrases.WE_RECEIVED_YOUR_QUESTION, [user.name]);
    await user.bot.sendMessage(user.botId, message);
  }

  protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    const message = Translator.getMessage(user.lang, Phrases.WE_RECEIVED_YOUR_QUESTION, [user.name]);
    await user.bot.sendMessage(user.botId, message);
  }

}
