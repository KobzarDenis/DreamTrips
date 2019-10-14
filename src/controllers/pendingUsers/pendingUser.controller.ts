import {Request} from "express";
import {PendingUserModel} from "@core/models/pendingUser.model";
import {Op} from "sequelize";
import {Logger} from "@core/Logger";
import {UserModel} from "@core/models/user.model";

export class PendingUserController {

    public static async list(req: Request) {
        Logger.getInstance().info(`List pending: [${JSON.stringify(req.params)}]`);
        await PendingUserModel.findAll({where: {date: {[Op.lte]: new Date()}}, include: [UserModel]});
    }

}
