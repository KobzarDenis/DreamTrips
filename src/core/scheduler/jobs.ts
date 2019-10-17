import {ISchedule, CronPeriod} from "./interfaces";
import {SystemBot} from "@core/bots";
import {PendingUserModel} from "@core/models/pendingUser.model";
import {Op} from "sequelize";
import {DateHelper} from "@core/helpers/Date.helper";
import {MeetingRequestModel} from "@core/models/meetingRequest.model";
import {UserModel} from "@core/models/user.model";

export const jobs: ISchedule[] = [
    {
        period: CronPeriod.EveryDayAtNight,
        name: "Persist Data From Redis",
        cb: () => {SystemBot.getInstance().broadcast(`N count of rows persisted`)}
    },
    {
        period: CronPeriod.EveryMondayAtNoon,
        name: "Send news",
        cb: () => {SystemBot.getInstance().broadcast(`Sent updates`)}
    },
    {
        period: CronPeriod.EverySaturdayAtNine,
        name: "Send remind about noon meeting [12.00]",
        cb: () => {SystemBot.getInstance().broadcast(`Sent reminds`)}
    },
    {
        period: CronPeriod.EverySaturdayAtSeventeen,
        name: "Send remind about evening meeting [20.00]",
        cb: () => {SystemBot.getInstance().broadcast(`Sent reminds`)}
    },
    {
        period: CronPeriod.EveryDayFromSevenTilNinePM,
        name: "Send system statistic",
        cb: async () => {
            const oneHourAgo = DateHelper.getTimeNHourAgo(1);
            const countOfPendingUsers = await PendingUserModel.count({where: {date: {[Op.gte]: oneHourAgo}}});
            const countOfMeetingRequests = await MeetingRequestModel.count({where: {createdAt: {[Op.gte]: oneHourAgo}}});
            const countOfStartedUsersFB = await UserModel.count({where: {[Op.and]: [{createdAt: {[Op.gte]: oneHourAgo}}, {botSource: "facebook"}]}});
            const countOfStartedUsersTG = await UserModel.count({where: {[Op.and]: [{createdAt: {[Op.gte]: oneHourAgo}}, {botSource: "telegram"}]}});

            const message = `Обновления за прошедший час:\nНовых заявок на обратную связь: +${countOfPendingUsers}\nНовых заявок на вебинар: +${countOfMeetingRequests}\nПришедших FB: +${countOfStartedUsersFB}, TG: +${countOfStartedUsersTG}`;

            await SystemBot.getInstance().broadcast(message);
        }
    }
];
