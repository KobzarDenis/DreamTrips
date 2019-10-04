import {ISchedule, CronPeriod} from "./interfaces";

export const jobs: ISchedule[] = [
    {
        period: CronPeriod.EveryDayAtNight,
        name: "Persist Data From Redis",
        cb: () => {console.log(`N count of rows persisted`)}
    },
    {
        period: CronPeriod.EveryMondayAtNoon,
        name: "Send news",
        cb: () => {console.log(`Sent updates`)}
    },
    {
        period: CronPeriod.EverySaturdayAtNine,
        name: "Send remind about noon meeting [12.00]",
        cb: () => {console.log(`Sent reminds`)}
    },
    {
        period: CronPeriod.EverySaturdayAtSeventeen,
        name: "Send remind about evening meeting [20.00]",
        cb: () => {console.log(`Sent reminds`)}
    },
    {
        period: CronPeriod.EveryDayFromSevenTilNinePM,
        name: "Send system statistic",
        cb: () => {console.log(`Sent statistic`)}
    }
];
