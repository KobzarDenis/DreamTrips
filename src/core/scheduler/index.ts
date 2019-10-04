import * as cron from "cron";
import {jobs} from "./jobs";
import {Logger} from "@core/Logger";

export class Scheduler {
    private static instance: Scheduler;
    private cronJobs: cron.CronJob[];
    private logger: Logger;

    private constructor() {
        this.cronJobs = [];
        this.logger = Logger.getInstance();
    }

    public static getInstance(): Scheduler {
        if (!Scheduler.instance) {
            Scheduler.instance = new Scheduler();
        }

        return Scheduler.instance;
    }

    public async init() {
        jobs.forEach(j => {
            const job = new cron.CronJob(j.period, () => {
                try {
                    j.cb();
                    this.logger.info(`CronJob invocation [${j.name}]: SUCCESS`);
                } catch (e) {
                    this.logger.error(`CronJob invocation [${j.name}]: FAILED {${e.message}`);
                }
            }, null, true, 'Europe/Kiev');

            this.cronJobs.push(job);
            this.logger.info(`CronJob registered: name [${j.name}] period [${j.period}]`);
        });
    }

    public setTask(name: string, period: string, cb: () => void) {
        throw new Error("Not implemented.")
    }

    public deleteTask(name: string) {
        throw new Error("Not implemented.")
    }
}
