import { User } from "@core/fsm/User";
import { Redis } from "@core/Redis";

export class StateHolder {

  public static bots;
  public static states;

  public static async getUser(key: string): Promise<User> {
    const dto = JSON.parse(await Redis.getInstance().getItem(key));
    return new User(dto.id, dto.name, dto.lang, StateHolder.bots[dto.botSource], dto.botSource, dto.botId, StateHolder.states[dto.currentStateName]);
  }

  public static async setUser(key: string, user: User): Promise<boolean> {
    return await Redis.getInstance().setItem(key, user.pack(), Redis.WEEK_TTL);
  }

}
