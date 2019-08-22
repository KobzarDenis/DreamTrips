import { User } from "../User";
import { State } from "./State";
import { AttractionSecondState } from "./AttractionSecond.state"
import { Bot, Button, IncomingMessage } from "@core/bots/Bot";
import { Configurator } from "@core/bots/Configurator";
import { Buttons, Phrases, Translator } from "@core/bots/translator";

export class AttractionFirstState extends State {
  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!AttractionFirstState._instance) {
      AttractionFirstState._instance = new AttractionFirstState();
    }

    return AttractionFirstState._instance;
  }

  protected async do(user: User, data: IncomingMessage): Promise<void> {
    let msg: string;

    switch (data.command) {
      case Configurator.getButtonValue(Buttons.ONES_PER_YEAR):
        msg = Translator.getMessage(user.lang, Phrases.NOT_BAD);
        break;
      case Configurator.getButtonValue(Buttons.THREE_TIMES_PER_YEAR):
        msg = Translator.getMessage(user.lang, Phrases.COOL);
        break;
      case Configurator.getButtonValue(Buttons.MORE_OFTEN):
        msg = Translator.getMessage(user.lang, Phrases.WOW);
        break;
      case Configurator.getButtonValue(Buttons.MORE_OFTEN):
      default:
        msg = Translator.getMessage(user.lang, Phrases.DONT_WORRY);
        break;
    }

    const question = Translator.getMessage(user.lang, Phrases.DO_YOU_WANNA_KNOW_HOW_TO_TRAVEL_MORE);

    const buttons: Button[] = [
      {
        text: Translator.getButtonText(user.lang, Buttons.YES_I_WANT),
        value: Configurator.getButtonValue(Buttons.YES_I_WANT)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.OFCOURSE),
        value: Configurator.getButtonValue(Buttons.OFCOURSE)
      }
    ];

    await user.bot.sendMessage(user.botId, msg);
    setTimeout(async () => {
      await user.bot.sendMessage(user.botId, question, buttons);
      super.changeState(user, AttractionSecondState.getInstance());
    }, Bot.SHORT_PAUSE_MS);
  }
}
