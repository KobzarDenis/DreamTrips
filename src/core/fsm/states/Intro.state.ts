import { User } from "../User";
import { State, StateName } from "./State";
import { Bot, Button, IncomingMessage } from "@core/bots/Bot";
import { WhoWeAreState } from "./WhoWeAre.state";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Configurator } from "@core/bots/Configurator";
import { Options } from "../decorators";

@Options(StateName.Intro)
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

  protected async do(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    const prepare = Translator.getMessage(user.lang, Phrases.PREPARE_FOR_MAGIC);
    const opening = Translator.getMessage(user.lang, Phrases.OPENING);
    const video = Translator.getMessage(user.lang, Phrases.VIDEO);
    const question = Translator.getMessage(user.lang, Phrases.INSPIRED_OR_NOT);

    const buttons: Button = {
      text: Translator.getButtonText(user.lang, Buttons.ABSOLUTELY),
      value: Configurator.getButtonValue(Buttons.ABSOLUTELY)
    };

    await user.bot.sendMessage(user.botId, prepare);
    await user.bot.typingOn(user.botId);
    setTimeout(async () => {
      await user.bot.typingOff(user.botId);
      await user.bot.sendMessage(user.botId, opening);
      await user.bot.typingOn(user.botId);
      setTimeout(async () => {
        await user.bot.typingOff(user.botId);
        await user.bot.sendMessage(user.botId, video);
        await user.bot.typingOn(user.botId);
        setTimeout(async () => {
          await user.bot.typingOff(user.botId);
          await user.bot.sendVideo(user.botId, "video/dreamtrips.mp4");
          await user.bot.typingOn(user.botId);
          setTimeout(async () => {
            await user.bot.typingOff(user.botId);
            await user.bot.sendMessage(user.botId, question, buttons);
            await super.changeState(user, WhoWeAreState.getInstance());
          }, Bot.LONG_PAUSE_MS);
        }, Bot.MID_PAUSE_MS);
      }, Bot.MID_PAUSE_MS);
    }, Bot.SHORT_PAUSE_MS);
  }

  protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    await user.bot.sendMessage(user.botId, `You are currently in ${this.name} state.`)
  }
}
