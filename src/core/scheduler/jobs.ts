import {ISchedule, CronPeriod} from "./interfaces";
import {SystemBot} from "@core/bots";

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
        cb: () => {SystemBot.getInstance().broadcast(`Sent statistic`)}
    }
];
