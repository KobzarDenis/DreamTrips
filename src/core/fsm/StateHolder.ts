import {User} from "@core/fsm/User";
import {Redis} from "@core/Redis";
import {Langs} from "@core/bots/translator";
import {UserModel} from "@core/models/user.model";
import {Op} from "sequelize";
import {UserStateModel} from "@core/models/userState.model";

export class StateHolder {

    private static bots;
    private static states;

    public static init(bots, states) {
        StateHolder.bots = bots;
        StateHolder.states = states;
    }

    public static async setup(firstName: string, lastName: string, lang: Langs, botSource: string, botId: string, userId?: string) {
        let $user = await UserModel.findOne({
            where: {
                [Op.or]: [{uuid: userId}, {
                    [Op.and]: {
                        botId: botId.toString(),
                        botSource
                    }
                }]
            }
        });

        if ($user && ($user.botId != botId || $user.botSource != botSource || $user.lang != lang)) {
            await $user.update({botSource, botId, lang});
        } else {
            $user = new UserModel({firstName, lastName, botSource, botId, lang});
            await $user.save();
            await UserStateModel.create({userId: $user.id, state: "greeting", mood: "unknown"});
        }

        const user = new User($user.id, $user.firstName, $user.lang, StateHolder.bots[botSource], botSource, botId);
        await StateHolder.setUser(`${botSource}:${botId}`, user);
        await user.handleAction({chat: {id: botId}, userId: $user.uuid, payload: null, command: "", original: ""});
    }

    public static async getUserAndMeta(key: string): Promise<any> {
        const dto = await Redis.getInstance().getItem(key);
        let userState;

        if (!dto) {
            const conditions = key.split(':');
            userState = await UserModel.findOne({
                where: {
                    botSource: conditions[0],
                    botId: conditions[1]
                }, include: [UserStateModel]
            });
        } else {
            userState = JSON.parse(dto);
        }

        const user = new User(userState.id, userState.name || userState.firstName, userState.lang, StateHolder.bots[userState.botSource], userState.botSource, userState.botId, StateHolder.states[userState.currentStateName || userState.state.state]);

        return {
            user,
            additional: userState.additional || null
        };
    }

    public static async setUser(key: string, user: User, ttl?: number, additional?: any): Promise<boolean> {
        return await Redis.getInstance().setItem(key, user.pack(additional), ttl || Redis.WEEK_TTL);
    }

}
