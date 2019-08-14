import { Langs } from "../bots/translator";
import { UserModel } from "@core/models/user.model";
import { User } from "./User";
import { Bot } from "@core/bots";
import { StateHolder } from "@core/fsm/StateHolder";
import { Op } from "sequelize";

export class StateBuilder {

  public static async setup(firstName: string, lastName: string, lang: Langs, bot: Bot, botSource: string, botId: string, userId?: string) {
    let $user = await UserModel.findOne({ where: { [Op.or]: [{ uuid: userId }, { [Op.and]: { botId: botId.toString(), botSource } }] } });

    if ($user) { // ToDo: Не надо обновлять если совпадения нашлись по боту
      await $user.update({ botSource, botId, lang });
    } else {
      $user = new UserModel({ firstName, lastName, botSource, botId, lang });
      await $user.save();
    }

    const user = new User($user.id, $user.firstName || firstName, $user.lang || lang, bot);
    StateHolder.setUser(`${botSource}__${botId}`, user);
    await user.handleAction({ chat: { id: botId }, userId: $user.uuid, payload: null, command: "" });
  }

}
