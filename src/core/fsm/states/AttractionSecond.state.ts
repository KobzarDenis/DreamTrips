import { User } from "../User";
import { State, StateName } from "./State";
import { IntroState } from "./Intro.state";
import { Button, IncomingMessage } from "@core/bots/Bot";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Configurator } from "@core/bots/Configurator";
import { Options } from "../decorators";

@Options(StateName.AttractionSecond)
export class AttractionSecondState extends State {
  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!AttractionSecondState._instance) {
      AttractionSecondState._instance = new AttractionSecondState();
    }

    return AttractionSecondState._instance;
  }

  protected async do(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    const question = Translator.getMessage(user.lang, Phrases.DO_YOU_WANNA_TRAVELING_IMPRESSIVE);

    const buttons: Button = {
      text: Translator.getButtonText(user.lang, Buttons.SURE),
      value: Configurator.getButtonValue(Buttons.SURE)
    };

    await user.bot.sendMessage(user.botId, question, buttons);
    await super.changeState(user, IntroState.getInstance());
  }

  protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    await user.bot.sendMessage(user.botId, `You are currently in ${this.name} state.`)
  }
}
