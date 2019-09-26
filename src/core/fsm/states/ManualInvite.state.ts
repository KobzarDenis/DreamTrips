import { MoodState, User } from "../User";
import { State, StateName } from "./State";
import { Button, IncomingMessage } from "@core/bots/Bot";
import { Configurator } from "@core/bots/Configurator";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Options } from "../decorators";
import { MeetingPlanModel } from "@core/models/meetingPlan.model";
import { DateHelper } from "@core/helpers/Date.helper";
import {ContactCollectionState} from "@core/fsm/states/ContactCollection.state";

@Options(StateName.ManualInvite)
export class ManualInviteState extends State {
  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!ManualInviteState._instance) {
      ManualInviteState._instance = new ManualInviteState();
    }

    return ManualInviteState._instance;
  }

  protected async do(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    switch (data.command) {
      case Configurator.getButtonValue(Buttons.I_WONT_BE_ABLE_AT_THIS_TIME):
        await user.updateMood(MoodState.AGREE);
        await this.askContacts(user);
        break;
      case Configurator.getButtonValue(Buttons.I_WONT_BE_ABLE_AT_THIS_DAY):
        await user.updateMood(MoodState.AGREE);
        await this.inviteToNextWeek(user);
        break;
      case Configurator.getButtonValue(Buttons.NOT_INTERESTED):
        await this.sendBayBay(user);
        break;
      default:
        break;
    }
  }

  private async inviteToNextWeek(user: User) {
    const message = Translator.getMessage(user.lang, Phrases.WE_HAVE_MEETINGS_EVERY_WEEK, [user.name]);

    await user.bot.sendMessage(user.botId, message);
    await user.bot.sendSocialLinks(user.botId);

    await MeetingPlanModel.create({
      userId: user.id,
      date: DateHelper.getNextEventDate(),
      part: "evening",
      type: "both"
    })
  }

  private async askContacts(user: User) {
    const message = Translator.getMessage(user.lang, Phrases.LETS_CALL);

    const buttons: Button[] = [
      {
        text: Translator.getButtonText(user.lang, Buttons.EMAIL),
        value: Configurator.getButtonValue(Buttons.EMAIL)
      },
      {
        text: Translator.getButtonText(user.lang, Buttons.PHONE_NUMBER),
        value: Configurator.getButtonValue(Buttons.PHONE_NUMBER)
      }
    ];

    await user.bot.sendMessage(user.botId, message, buttons);
    await super.changeState(user, ContactCollectionState.getInstance());
  }


  private async sendBayBay(user: User) {
    const message = Translator.getMessage(user.lang, Phrases.HOPE_TO_SEE_YOU_NEXT_TIME, [user.name]);
    await user.bot.sendMessage(user.botId, message);
    await user.bot.sendSocialLinks(user.botId);
    await user.updateMood(MoodState.DISCARD);
  }

  protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    await user.bot.sendMessage(user.botId, `You are currently in ${this.name} state.`);
  }
}
