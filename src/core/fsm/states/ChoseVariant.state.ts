import { User } from "../User";
import { State, StateName } from "./State";
import { Button, IncomingMessage } from "@core/bots/Bot";
import { Configurator } from "@core/bots/Configurator";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Options } from "../decorators";
import { InvitaionState } from "./Invitaion.state";
import { Redis } from "@core/Redis";

@Options(StateName.ChoseVariant)
export class ChoseVariantState extends State {
  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!ChoseVariantState._instance) {
      ChoseVariantState._instance = new ChoseVariantState();
    }

    return ChoseVariantState._instance;
  }

  protected async do(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    const question = Translator.getMessage(user.lang, Phrases.CHOOSE_YOUR_BEST, [user.name]);

    const buttons: Button[] = [
      {
        text: Translator.getButtonText(user.lang, Buttons.FIRST_VARIANT),
        value: Configurator.getButtonValue(Buttons.FIRST_VARIANT)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.SECOND_VARIANT),
        value: Configurator.getButtonValue(Buttons.SECOND_VARIANT)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.THIRD_VARIANT),
        value: Configurator.getButtonValue(Buttons.THIRD_VARIANT)
      }
    ];

    await user.bot.sendMessage(user.botId, question, buttons);
    await super.changeState(user, InvitaionState.getInstance(), Redis.MONTH_TTL);
  }

  protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    await super.reply(user, data, additional);
  }
}
