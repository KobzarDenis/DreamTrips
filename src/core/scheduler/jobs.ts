import {ISchedule, CronPeriod} from "./interfaces";
import {SystemBot} from "@core/bots";
import {PendingUserModel} from "@core/models/pendingUser.model";
import {Op} from "sequelize";
import {DateHelper} from "@core/helpers/Date.helper";
import {MeetingRequestModel} from "@core/models/meetingRequest.model";
import {UserModel} from "@core/models/user.model";
import {Redis} from "@core/Redis";
import {UserStateModel} from "@core/models/userState.model";
import {Logger} from "@core/Logger";

export async function persistDataFromRedis() {
    let counter = 0;
    const redis = Redis.getInstance();
    const logger = Logger.getInstance();
    const keys = await redis.getAllKeys();

    logger.info(`[persistDataFromRedis] - all keys: ${keys.join(',')}`);

    for (const key of keys) {
        logger.info(`[persistDataFromRedis] - key to process: ${key}`);
        const dto = await redis.getItem(key);
        const userInMemory = JSON.parse(dto);
        logger.info(`[persistDataFromRedis] - dto: ${dto}`);

        const $userState = await UserStateModel.findOne({where: {userId: userInMemory.id}});

        if ($userState) {
            $userState.state = userInMemory.currentStateName;
            await $userState.save();
            await redis.removeItem(key);
            counter++;
        }
    }

    SystemBot.getInstance().broadcast(`${counter} rows persisted`);
}

export async function sendHourlySystemStatistic() {
    let message;

    const oneHourAgo = DateHelper.getTimeNHourAgo(1);
    // const countOfPendingUsers = await PendingUserModel.count({where: {date: {[Op.gte]: oneHourAgo}}});
    // const countOfMeetingRequests = await MeetingRequestModel.count({where: {createdAt: {[Op.gte]: oneHourAgo}}});
    // const countOfStartedUsersFB = await UserModel.count({where: {[Op.and]: [{createdAt: {[Op.gte]: oneHourAgo}}, {botSource: "facebook"}]}});
    // const countOfStartedUsersTG = await UserModel.count({where: {[Op.and]: [{createdAt: {[Op.gte]: oneHourAgo}}, {botSource: "telegram"}]}});

    //ToDo: Delete it!!!
    const countOfPendingUsers = Math.floor(Math.random() * 10);
    const countOfMeetingRequests = Math.floor(Math.random() * 10);
    const countOfStartedUsersFB = 0;
    const countOfStartedUsersTG = Math.floor(Math.random() * 10);

    const isUpdateExists = !!(countOfPendingUsers + countOfMeetingRequests + countOfStartedUsersFB + countOfStartedUsersTG);
    if (isUpdateExists) {
        message = `Обновления за прошедший час:\nНовых заявок на обратную связь: +${countOfPendingUsers}\nНовых заявок на вебинар: +${countOfMeetingRequests}\nПришедших FB: +${countOfStartedUsersFB}, TG: +${countOfStartedUsersTG}`;
    } else {
        message = `Обновлений за прошедший час - 0`;
    }

    await SystemBot.getInstance().broadcast(message);
}

export const jobs: ISchedule[] = [
    {
        period: CronPeriod.EveryNight,
        name: "Persist Data From Redis",
        cb: persistDataFromRedis
    },
    {
        period: CronPeriod.EveryMondayAtNoon,
        name: "Send news",
        cb: () => {
            SystemBot.getInstance().broadcast(`Sent updates`)
        }
    },
    {
        period: CronPeriod.EverySaturdayAtNine,
        name: "Send remind about noon meeting [12.00]",
        cb: () => {
            SystemBot.getInstance().broadcast(`Sent reminds`)
        }
    },
    {
        period: CronPeriod.EverySaturdayAtSeventeen,
        name: "Send remind about evening meeting [20.00]",
        cb: () => {
            SystemBot.getInstance().broadcast(`Sent reminds`)
        }
    },
    {
        period: CronPeriod.EveryDayFromSevenTilNinePM,
        name: "Send system statistic",
        cb: sendHourlySystemStatistic
    }
];
