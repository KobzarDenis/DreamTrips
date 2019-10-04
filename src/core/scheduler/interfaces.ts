export enum CronPeriod {
    EveryDayAtNight = "0 0 * * *",
    EveryDayAtNoon = "0 12 * * *",
    EveryMondayAtNoon = "0 12 * * 1",
    EverySaturdayAtNine = "0 9 * * 6",
    EverySaturdayAtSeventeen = "0 17 * * 6",
    EveryDayFromSevenTilNinePM = "0 7-21 * * *"
}

export interface ISchedule {
    name: string,
    period: CronPeriod,
    cb: Function
};
