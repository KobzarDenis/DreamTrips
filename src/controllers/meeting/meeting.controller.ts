import {Request} from "express";
import {WebinarModel} from "@core/models/webinar.model";
import {createValidator} from "./meeting.validator";
import {ValidationError} from "@core/errors";

export class MeetingController {

    public static async createGoogle(req: Request) {
        if(!createValidator(req.body)) {
            throw new ValidationError(createValidator.errors);
        }
        const $meeting = new WebinarModel(req.body);

        return $meeting;
    }

    public static async createInternal(req: Request) {
        throw new Error("Not implemented.")
    }

    public static async sendInviteByEmail(req: Request) {
        throw new Error("Not implemented.")
    }

    public static async sendInviteBySMS(req: Request) {
        throw new Error("Not implemented.")
    }

    public static async sendInviteByBot(req: Request) {
        throw new Error("Not implemented.")
    }

    public static async sendBulkInvites(req: Request) {
        throw new Error("Not implemented.")
    }

}
