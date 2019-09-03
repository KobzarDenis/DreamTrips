import { State, StateName } from "./State";
import { User } from "../User";
import { Bot, Button, IncomingMessage } from "@core/bots/Bot";
import { AttractionFirstState } from "./AttractionFirst.state";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Configurator } from "@core/bots/Configurator";
import { Options } from "../decorators";

@Options(StateName.Entry)
export class EntryState extends State {

  private static _instance: EntryState;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!EntryState._instance) {
      EntryState._instance = new EntryState();
    }

    return EntryState._instance;
  }

  protected async do(user: User, data: IncomingMessage): Promise<void> {
    const msg = Translator.getMessage(user.lang, Phrases.INTRO);
    const question = Translator.getMessage(user.lang, Phrases.HOW_OFTEN_DO_YOU_TRAVEL);

    const buttons: Button[] = [
      {
        text: Translator.getButtonText(user.lang, Buttons.ONES_PER_YEAR),
        value: Configurator.getButtonValue(Buttons.ONES_PER_YEAR)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.MORE_OFTEN),
        value: Configurator.getButtonValue(Buttons.MORE_OFTEN)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.HAVE_NEVER_TRAVELING),
        value: Configurator.getButtonValue(Buttons.HAVE_NEVER_TRAVELING)
      }
    ];

    await user.bot.sendMessage(user.botId, msg);
    await user.bot.typingOn(user.botId);
    setTimeout(async () => {
      await user.bot.typingOff(user.botId);
      await user.bot.sendMessage(user.botId, question, buttons);
      await super.changeState(user, AttractionFirstState.getInstance());
    }, Bot.MID_PAUSE_MS);
  }

}
