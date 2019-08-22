import { User } from "../User";
import { State } from "./State";
import { Bot, Button, IncomingMessage } from "@core/bots/Bot";
import { WhoWeAreState } from "./WhoWeAre.state";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Configurator } from "@core/bots/Configurator";

export class IntroState extends State {
  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!IntroState._instance) {
      IntroState._instance = new IntroState();
    }

    return IntroState._instance;
  }

  protected async do(user: User, data: IncomingMessage): Promise<void> {
    const prepare = Translator.getMessage(user.lang, Phrases.PREPARE_FOR_MAGIC);
    const opening = Translator.getMessage(user.lang, Phrases.OPENING);
    const video = Translator.getMessage(user.lang, Phrases.VIDEO);
    const link = `https://www.youtube.com/watch?v=NGAEB4N0Evs`;
    const question = Translator.getMessage(user.lang, Phrases.INSPIRED_OR_NOT);

    const buttons: Button = {
      text: Translator.getButtonText(user.lang, Buttons.ABSOLUTELY),
      value: Configurator.getButtonValue(Buttons.ABSOLUTELY)
    };

    await user.bot.sendMessage(user.botId, prepare);
    setTimeout(async () => {
      await user.bot.sendMessage(user.botId, opening);
      setTimeout(async () => {
        await user.bot.sendMessage(user.botId, video);
        setTimeout(async () => {
          await user.bot.sendMessage(user.botId, link);
          setTimeout(async () => {
            await user.bot.sendMessage(user.botId, question, buttons);
            super.changeState(user, WhoWeAreState.getInstance());
          }, Bot.LONG_PAUSE_MS);
        }, Bot.MID_PAUSE_MS);
      }, Bot.MID_PAUSE_MS);
    }, Bot.SHORT_PAUSE_MS);
  }
}
