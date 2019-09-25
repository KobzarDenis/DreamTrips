import * as cron from "cron";

export class Scheduler {
    private static instance: Scheduler;

    private constructor() {
    }

    public static getInstance(): Scheduler {
        if (!Scheduler.instance) {
            Scheduler.instance = new Scheduler();
        }

        return Scheduler.instance;
    }

    public setTask(name: string, period: string, cb: () => void) {

    }

    public deleteTask(name: string) {

    }
}