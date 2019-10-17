import {ISchedule, CronPeriod} from "./interfaces";
import {SystemBot} from "@core/bots";
import {PendingUserModel} from "@core/models/pendingUser.model";
import {Op} from "sequelize";
import {DateHelper} from "@core/helpers/Date.helper";
import {MeetingRequestModel} from "@core/models/meetingRequest.model";

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

            const message = `Обновления за прошедший час:\n
                             Новых заявок на обратную связь: +${countOfPendingUsers}\n
                             Новых заявок на вебинар: +${countOfMeetingRequests}`;

            SystemBot.getInstance().broadcast(message);
        }
    }
];
