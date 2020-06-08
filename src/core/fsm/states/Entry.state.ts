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

  protected async do(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    const msg = `Choose your favorite from these and move on!`;

    const buttons: Button[] = [
      {
        text: "1. Pizza",
        value: Configurator.getButtonValue(Buttons.ONES_PER_YEAR)
      },
      {
        text: "2. Pasta",
        value: Configurator.getButtonValue(Buttons.MORE_OFTEN)
      },
      {
        text: "3. Salads",
        value: Configurator.getButtonValue(Buttons.HAVE_NEVER_TRAVELING)
      }
    ];

    await user.bot.sendMessage(user.botId, "Here you go!");
    await user.bot.typingOn(user.botId);
    setTimeout(async () => {
      await user.bot.typingOff(user.botId);
      await user.bot.sendImage(user.botId, "https://storage.googleapis.com/nakedbeaver/menu.jpeg");
      await user.bot.sendMessage(user.botId, msg, buttons);
      await super.changeState(user, AttractionFirstState.getInstance());
    }, Bot.MID_PAUSE_MS);
  }

  protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    await super.reply(user, data, additional);
  }

}
