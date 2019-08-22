import { User } from "../User";
import { State } from "./State";
import { Bot, Button, IncomingMessage } from "@core/bots/Bot";
import { Configurator } from "@core/bots/Configurator";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { ChoseVariantState } from "./ChoseVariant.state";
import { ObjectionsState } from "./Objections.state";

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
  protected async do(user: User, data: IncomingMessage): Promise<void> {
    switch (data.command) {
      case Configurator.getButtonValue(Buttons.YES_I_HAVE_A_QUESTION):
        await this.sendForUnknowing(user);
        break;
      case Configurator.getButtonValue(Buttons.NO_I_KNOW_WHO_YOU_ARE):
        await this.sendForKnowing(user);
        break;
      case Configurator.getButtonValue(Buttons.HUNDRED_PERCENT):
        super.changeState(user, ChoseVariantState.getInstance());
        await user.handleAction(data);
        break;
      case Configurator.getButtonValue(Buttons.IM_NOT_SURE):
        super.changeState(user, ObjectionsState.getInstance());
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
    setTimeout(async () => {
      await user.bot.sendMessage(user.botId, presentationPart2);
      setTimeout(async () => {
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
}
