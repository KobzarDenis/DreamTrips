import {Request} from "express";
import {MeetingRequestModel} from "@core/models/meetingRequest.model";
import * as sequelize from "sequelize";
import {DateHelper} from "@core/helpers/Date.helper";

export class MeetingRequestController {

    public static async list(req: Request) {
        const meetingRequests = await MeetingRequestModel.findAll({
            where: sequelize.where(sequelize.fn('DATE', sequelize.col(`MeetingRequestModel.createdAt`)), DateHelper.formatToDateOnly(new Date()))
        });

        return meetingRequests;
    }

    public static async create(req: Request) {
        throw new Error("Not implemented.");
    }

    public static async delete(req: Request) {
        await MeetingRequestModel.destroy({where: {id: req.body.id}});
    }

    public static async update(req: Request) {
        throw new Error("Not implemented.");
    }

}
