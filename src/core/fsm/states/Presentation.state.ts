import { MoodState, User } from "../User";
import { State, StateName } from "./State";
import { Bot, Button, IncomingMessage } from "@core/bots/Bot";
import { Configurator } from "@core/bots/Configurator";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { ChoseVariantState } from "./ChoseVariant.state";
import { ObjectionsState } from "./Objections.state";
import { Options } from "../decorators";
import { Redis } from "@core/Redis";

@Options(StateName.Presentation)
export class PresentationState extends State {
  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!PresentationState._instance) {
      PresentationState._instance = new PresentationState();
    }

    return PresentationState._instance;
  }

  //ToDo: Create next state!!!
  protected async do(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    switch (data.command) {
      case Configurator.getButtonValue(Buttons.YES_I_HAVE_A_QUESTION):
        await this.sendForUnknowing(user);
        break;
      case Configurator.getButtonValue(Buttons.NO_I_KNOW_WHO_YOU_ARE):
        await this.sendForKnowing(user);
        break;
      case Configurator.getButtonValue(Buttons.HUNDRED_PERCENT):
        await super.changeState(user, ChoseVariantState.getInstance(), Redis.MONTH_TTL);
        await user.handleAction(data);
        break;
      case Configurator.getButtonValue(Buttons.IM_NOT_SURE):
        await super.changeState(user, ObjectionsState.getInstance(), Redis.MONTH_TTL);
        await user.updateStateAndMood(this.name, MoodState.UNCERTAINTY);
        await user.handleAction(data);
        break;
    }
  }

  private async sendForKnowing(user: User) {
    const msg = Translator.getMessage(user.lang, Phrases.YOU_KNOW_ABOUT_US);

    await user.bot.sendMessage(user.botId, msg);
    await this.sendQuestion(user);
  }

  private async sendForUnknowing(user: User) {
    const presentationPart1 = Translator.getMessage(user.lang, Phrases.PRESENTATION_1);
    const presentationPart2 = Translator.getMessage(user.lang, Phrases.PRESENTATION_2);
    const presentationPart3 = Translator.getMessage(user.lang, Phrases.PRESENTATION_3);

    await user.bot.sendMessage(user.botId, presentationPart1);
    await user.bot.typingOn(user.botId);
    setTimeout(async () => {
      await user.bot.typingOff(user.botId);
      await user.bot.sendMessage(user.botId, presentationPart2);
      await user.bot.typingOn(user.botId);
      setTimeout(async () => {
        await user.bot.typingOff(user.botId);
        await user.bot.sendMessage(user.botId, presentationPart3);
        await this.sendQuestion(user);
      }, Bot.LONG_PAUSE_MS);
    }, Bot.LONG_PAUSE_MS);
  }

  private async sendQuestion(user: User) {
    const question = Translator.getMessage(user.lang, Phrases.DO_YOU_WANNA_KNOW_MORE_ABOUT_BUSINESS);

    const buttons: Button[] = [
      {
        text: Translator.getButtonText(user.lang, Buttons.HUNDRED_PERCENT),
        value: Configurator.getButtonValue(Buttons.HUNDRED_PERCENT)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.IM_NOT_SURE),
        value: Configurator.getButtonValue(Buttons.IM_NOT_SURE)
      }
    ];

    await user.bot.sendMessage(user.botId, question, buttons);
  }

  protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    await super.reply(user, data, additional);
  }

}
