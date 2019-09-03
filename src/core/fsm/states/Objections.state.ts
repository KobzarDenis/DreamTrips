import { User } from "../User";
import { State, StateName } from "./State";
import { Button, IncomingMessage } from "@core/bots/Bot";
import { Configurator } from "@core/bots/Configurator";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Options } from "../decorators";
import { InvitaionState } from "./Invitaion.state";
import { ManualInviteState } from "@core/fsm/states/ManualInvite.state";
import { Redis } from "@core/Redis";

@Options(StateName.Objections)
export class ObjectionsState extends State {
  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!ObjectionsState._instance) {
      ObjectionsState._instance = new ObjectionsState();
    }

    return ObjectionsState._instance;
  }

  protected async do(user: User, data: IncomingMessage): Promise<void> {
    switch (data.command) {
      case Configurator.getButtonValue(Buttons.IM_NOT_SURE):
        await this.brokeUncertainty(user);
        break;
      case Configurator.getButtonValue(Buttons.I_WONT_COMING):
        await this.brokeBlock(user);
        break;
      default:
        break;
    }
  }

  private async brokeUncertainty(user: User) {
    const question = Translator.getMessage(user.lang, Phrases.WHY_DID_YOU_DISCARD_IT, [user.name]);

    const buttons: Button[] = [
      {
        text: Translator.getButtonText(user.lang, Buttons.TOO_CONFUSING),
        value: Configurator.getButtonValue(Buttons.TOO_CONFUSING)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.NOT_ENOUGH_INFO),
        value: Configurator.getButtonValue(Buttons.NOT_ENOUGH_INFO)
      }
    ];

    await user.bot.sendMessage(user.botId, question, buttons);
    await super.changeState(user, InvitaionState.getInstance(), Redis.MONTH_TTL);
  }

  private async brokeBlock(user: User) {
    const question = Translator.getMessage(user.lang, Phrases.WHY_YOU_WONT_TO_COME, [user.name]);

    const buttons: Button[] = [
      {
        text: Translator.getButtonText(user.lang, Buttons.I_WONT_BE_ABLE_AT_THIS_DAY),
        value: Configurator.getButtonValue(Buttons.I_WONT_BE_ABLE_AT_THIS_DAY)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.I_WONT_BE_ABLE_AT_THIS_TIME),
        value: Configurator.getButtonValue(Buttons.I_WONT_BE_ABLE_AT_THIS_TIME)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.NOT_INTERESTED),
        value: Configurator.getButtonValue(Buttons.NOT_INTERESTED)
      }
    ];

    await user.bot.sendMessage(user.botId, question, buttons);
    await super.changeState(user, ManualInviteState.getInstance());
  }

}
