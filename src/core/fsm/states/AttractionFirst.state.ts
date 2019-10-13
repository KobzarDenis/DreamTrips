import { User } from "../User";
import { State, StateName } from "./State";
import { AttractionSecondState } from "./AttractionSecond.state"
import { Bot, Button, IncomingMessage } from "@core/bots/Bot";
import { Configurator } from "@core/bots/Configurator";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Options } from "../decorators";

@Options(StateName.AttractionFirst)
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

  protected async do(user: User, data: IncomingMessage, additional?: any): Promise<void> {
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
      case Configurator.getButtonValue(Buttons.HAVE_NEVER_TRAVELING):
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
    await user.bot.typingOn(user.botId);
    setTimeout(async () => {
      await user.bot.typingOff(user.botId);
      await user.bot.sendMessage(user.botId, question, buttons);
      await super.changeState(user, AttractionSecondState.getInstance());
    }, Bot.SHORT_PAUSE_MS);
  }

  protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    await super.reply(user, data, additional);
  }
}
