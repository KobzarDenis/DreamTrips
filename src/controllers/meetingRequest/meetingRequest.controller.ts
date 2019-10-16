import {Request} from "express";
import {WebinarModel} from "@core/models/webinar.model";
import {createValidator} from "./meetingRequest.validator";
import {ValidationError} from "@core/errors";
import {MeetingRequestModel} from "@core/models/meetingRequest.model";
import * as sequelize from "sequelize";

export class MeetingRequestController {

    public static async list(req: Request) {
        const meetingRequests = await MeetingRequestModel.findAll({
            where: sequelize.where(sequelize.fn('DATE', sequelize.col('date')), (new Date()).setHours(0,0,0,0))
        });

        return meetingRequests;
    }

    public static async create(req: Request) {
        throw new Error("Not implemented.")
    }

    public static async delete(req: Request) {
        throw new Error("Not implemented.")
    }

    public static async update(req: Request) {
        throw new Error("Not implemented.")
    }

}
