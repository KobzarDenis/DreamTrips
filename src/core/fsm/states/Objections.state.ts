import { User } from "../User";
import { State, StateName } from "./State";
import { Button, IncomingMessage } from "@core/bots/Bot";
import { Configurator } from "@core/bots/Configurator";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Options } from "../decorators";

@Options(StateName.Objections)
export class ObjectionsState extends State {
  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!ObjectionsState._instance) {
      ObjectionsState._instance = new ObjectionsState();
    }

    return ObjectionsState._instance;
  }

  protected async do(user: User, data: IncomingMessage): Promise<void> {
    const question = Translator.getMessage(user.lang, Phrases.WHY_DID_YOU_DISCARD_IT, [user.name]);

    const buttons: Button[] = [
      {
        text: Translator.getButtonText(user.lang, Buttons.TOO_CONFUSING),
        value: Configurator.getButtonValue(Buttons.TOO_CONFUSING)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.NOT_ENOUGH_INFO),
        value: Configurator.getButtonValue(Buttons.NOT_ENOUGH_INFO)
      }
    ];

    await user.bot.sendMessage(user.botId, question, buttons);
  }
}
