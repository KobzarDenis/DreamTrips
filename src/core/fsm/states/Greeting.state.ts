import { State, StateName } from "./State";
import { User } from "../User";
import { IncomingMessage } from "@core/bots/Bot";
import { EntryState } from "./Entry.state";
import { Button } from "@core/bots/Bot";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Configurator } from "@core/bots/Configurator";
import { Options } from "../decorators";

@Options(StateName.Greeting)
export class GreetingState extends State {

  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!GreetingState._instance) {
      GreetingState._instance = new GreetingState();
    }

    return GreetingState._instance;
  }

  protected async do(user: User, data: IncomingMessage): Promise<void> {
    const message = Translator.getMessage(user.lang, Phrases.GREETING, [user.name]);
    const button: Button = {
      text: Translator.getButtonText(user.lang, Buttons.GOGOGO),
      value: Configurator.getButtonValue(Buttons.GOGOGO)
    };

    await user.bot.sendMessage(user.botId, message, button);
    await super.changeState(user, EntryState.getInstance());
  }

  protected async reply(user: User, data: IncomingMessage): Promise<void> {
    await user.bot.sendMessage(user.botId, `You are currently in ${this.name} state.`)
  }

}
