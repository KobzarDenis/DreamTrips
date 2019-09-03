import { MoodState, User } from "../User";
import { State, StateName } from "./State";
import { Bot, Button, IncomingMessage } from "@core/bots/Bot";
import { Configurator } from "@core/bots/Configurator";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Options } from "../decorators";
import { AcceptionState } from "@core/fsm/states/Acception.state";
import { ObjectionsState } from "@core/fsm/states/Objections.state";
import { Redis } from "@core/Redis";

@Options(StateName.Invitation)
export class InvitaionState extends State {
  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!InvitaionState._instance) {
      InvitaionState._instance = new InvitaionState();
    }

    return InvitaionState._instance;
  }

  //ToDo: Create next state!!!
  protected async do(user: User, data: IncomingMessage): Promise<void> {
    let message: string;
    switch (data.command) {
      case Configurator.getButtonValue(Buttons.FIRST_VARIANT):
        message = Translator.getMessage(user.lang, Phrases.ONLY_TRAVELING_MEETING);
        await this.sendInvite(user, message, "travel");
        break;
      case Configurator.getButtonValue(Buttons.SECOND_VARIANT):
        message = Translator.getMessage(user.lang, Phrases.ONLY_BUSINESS_MEETING);
        await this.sendInvite(user, message, "business");
        break;
      case Configurator.getButtonValue(Buttons.THIRD_VARIANT):
        message = Translator.getMessage(user.lang, Phrases.BOTH_TRAVELING_AND_BUSINESS_MEETING);
        await this.sendInvite(user, message, "both");
        break;
      case Configurator.getButtonValue(Buttons.TOO_CONFUSING):
      case Configurator.getButtonValue(Buttons.NOT_ENOUGH_INFO):
        message = Translator.getMessage(user.lang, Phrases.ITS_NOT_A_BIG_DEAL);
        await this.sendInvite(user, message, "both");
        break;
      default:
        await this.processAnswer(user, data);
        break;
    }
  }

  private async sendInvite(user: User, message: string, type?: string) {
    const question = Translator.getMessage(user.lang, Phrases.CLOSEST_MEETING);
    const buttons: Button[] = [
      {
        text: Translator.getButtonText(user.lang, Buttons.NOON),
        value: `${Configurator.getButtonValue(Buttons.NOON)}:${type}`
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.EVENING),
        value: `${Configurator.getButtonValue(Buttons.EVENING)}:${type}`
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.I_WONT_COMING),
        value: Configurator.getButtonValue(Buttons.I_WONT_COMING)
      }
    ];

    await user.bot.sendMessage(user.botId, message);
    await user.bot.typingOn(user.botId);
    setTimeout(async () => {
      await user.bot.typingOff(user.botId);
      await user.bot.sendMessage(user.botId, question, buttons);
      await user.bot.typingOn(user.botId);
    }, Bot.MID_PAUSE_MS);
  }

  private async processAnswer(user: User, data: IncomingMessage) {
    switch (data.command) {
      case Configurator.getButtonValue(Buttons.NOON):
      case Configurator.getButtonValue(Buttons.EVENING):
        await super.changeState(user, AcceptionState.getInstance(), Redis.MONTH_TTL);
        await user.handleAction(data);
        break;
      case Configurator.getButtonValue(Buttons.I_WONT_COMING):
        await super.changeState(user, ObjectionsState.getInstance(), Redis.MONTH_TTL);
        await user.updateMood(MoodState.BLOCK);
        await user.handleAction(data);
        break;
      default:
        await user.bot.sendMessage(user.botId, `${user.name}, choose your variant please...`);
        break;
    }
  }

}
