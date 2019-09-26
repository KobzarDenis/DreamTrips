import { State, StateName } from "./State";
import { MoodState, User } from "../User";
import { IncomingMessage } from "@core/bots/Bot";
import { Buttons, Phrases, Translator } from "@core/bots/translator";
import { Options } from "../decorators";
import { Configurator } from "@core/bots/Configurator";
import { MeetingPlanModel } from "@core/models/meetingPlan.model";
import { FinishState } from "@core/fsm/states/Finish.state";
import { DateHelper } from "@core/helpers/Date.helper";
import { Redis } from "@core/Redis";

@Options(StateName.Acception)
export class AcceptionState extends State {

  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!AcceptionState._instance) {
      AcceptionState._instance = new AcceptionState();
    }

    return AcceptionState._instance;
  }

  protected async do(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    const message = Translator.getMessage(user.lang, Phrases.SEE_YOU, [user.name]);
    await user.bot.sendMessage(user.botId, message);
    await user.bot.sendSocialLinks(user.botId);

    if(data.command === Configurator.getButtonValue(Buttons.NOON)) {
      await MeetingPlanModel.create({
        userId: user.id,
        date: DateHelper.getClosestEventDate(),
        part: "noon",
        type: data.payload[0]
      });
    } else {
      await MeetingPlanModel.create({
        userId: user.id,
        date: DateHelper.getClosestEventDate(),
        part: "evening",
        type: data.payload[0]
      });
    }

    await user.updateMood(MoodState.AGREE);
    await super.changeState(user, FinishState.getInstance(), Redis.MONTH_TTL);
  }

  protected async reply(user: User, data: IncomingMessage, additional?: any): Promise<void> {
    await user.bot.sendMessage(user.botId, `You are currently in ${this.name} state.`)
  }

}
