import { State, StateName } from "./State";
import { User } from "../User";
import { IncomingMessage } from "@core/bots/Bot";
import { Phrases, Translator } from "@core/bots/translator";
import { Options } from "../decorators";

@Options(StateName.Acception)
export class AcceptionState extends State {

  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!AcceptionState._instance) {
      AcceptionState._instance = new AcceptionState();
    }

    return AcceptionState._instance;
  }

  protected async do(user: User, data: IncomingMessage): Promise<void> {
    const message = Translator.getMessage(user.lang, Phrases.SEE_YOU, [user.name]);
    await user.bot.sendMessage(user.botId, message);
    await user.bot.sendSocialLinks(user.botId);
    //await super.changeState(user, EntryState.getInstance());
  }

}
