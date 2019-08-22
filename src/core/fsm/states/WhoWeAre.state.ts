import { User } from "../User";
import { State } from "./State";
import { Button, IncomingMessage } from "@core/bots/Bot";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Configurator } from "@core/bots/Configurator";
import { PresentationState } from "./Presentation.state";

export class WhoWeAreState extends State {
  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!WhoWeAreState._instance) {
      WhoWeAreState._instance = new WhoWeAreState();
    }

    return WhoWeAreState._instance;
  }

  protected async do(user: User, data: IncomingMessage): Promise<void> {
    const question = Translator.getMessage(user.lang, Phrases.DO_YOU_WANNA_KNOW_WHO_WE_ARE);

    const buttons: Button[] = [
      {
        text: Translator.getButtonText(user.lang, Buttons.YES_I_HAVE_A_QUESTION),
        value: Configurator.getButtonValue(Buttons.YES_I_HAVE_A_QUESTION)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.NO_I_KNOW_WHO_YOU_ARE),
        value: Configurator.getButtonValue(Buttons.NO_I_KNOW_WHO_YOU_ARE)
      }
    ];

    await user.bot.sendMessage(user.botId, question, buttons);
    super.changeState(user, PresentationState.getInstance());
  }
}
