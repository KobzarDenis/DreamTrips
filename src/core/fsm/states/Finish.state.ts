import { State, StateName } from "./State";
import { User } from "../User";
import { IncomingMessage } from "@core/bots/Bot";
import { Options } from "../decorators";

@Options(StateName.Finish)
export class FinishState extends State {

  private static _instance: State;

  private constructor() {
    super();
  }

  public static getInstance(): State {
    if (!FinishState._instance) {
      FinishState._instance = new FinishState();
    }

    return FinishState._instance;
  }

  protected async do(user: User, data: IncomingMessage): Promise<void> {
    //const message = Translator.getMessage(user.lang, Phrases.GREETING, [user.name]);
    const message = `${user.name}, мы получили Ваше сообщение и в скором времени мы на него ответим.\n Если у Вас есть дополнительные вопросы, выберите варианты из нижепредложенных: `
    await user.bot.sendMessage(user.botId, message);
  }

  protected async reply(user: User, data: IncomingMessage): Promise<void> {
    await user.bot.sendMessage(user.botId, `You are currently in ${this.name} state.`)
  }

}
