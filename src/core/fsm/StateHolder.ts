import { User } from "@core/fsm/User";
import { Redis } from "@core/Redis";
import { Langs } from "@core/bots/translator";
import { UserModel } from "@core/models/user.model";
import { Op } from "sequelize";

export class StateHolder {

  private static bots;
  private static states;

  public static init(bots, states) {
    StateHolder.bots = bots;
    StateHolder.states = states;
  }

  public static async setup(firstName: string, lastName: string, lang: Langs, botSource: string, botId: string, userId?: string) {
    let $user = await UserModel.findOne({ where: { [Op.or]: [{ uuid: userId }, { [Op.and]: { botId: botId.toString(), botSource } }] } });

    if ($user && ($user.botId != botId || $user.botSource != botSource || $user.lang != lang)) {
      await $user.update({ botSource, botId, lang });
    } else {
      $user = new UserModel({ firstName, lastName, botSource, botId, lang });
      await $user.save();
    }

    const user = new User($user.id, $user.firstName || firstName, $user.lang || lang, StateHolder.bots[botSource], botSource, botId);
    await StateHolder.setUser(`${botSource}__${botId}`, user);
    await user.handleAction({ chat: { id: botId }, userId: $user.uuid, payload: null, command: "" });
  }

  public static async getUser(key: string): Promise<User> {
    const dto = JSON.parse(await Redis.getInstance().getItem(key));
    return new User(dto.id, dto.name, dto.lang, StateHolder.bots[dto.botSource], dto.botSource, dto.botId, StateHolder.states[dto.currentStateName]);
  }

  public static async setUser(key: string, user: User, ttl: number = Redis.WEEK_TTL): Promise<boolean> {
    return await Redis.getInstance().setItem(key, user.pack(), ttl);
  }

}
