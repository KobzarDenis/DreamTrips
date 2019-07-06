import * as winston from "winston";
import { LoggerInstance } from "winston";

export class Logger  {
  private static instance: Logger;
  private winston: LoggerInstance;

  private constructor(private settings) {
    this.winston = new winston.Logger({
      level: settings.level,
      format: "json",
      colors: { info: "blue" }
    });

    this.winston.add(winston.transports.Console, {
      level: settings.level,
      colorize: true,
    });
  }

  public static getInstance(settings?): Logger {
    if (settings) {
      if (!Logger.instance) {
        Logger.instance = new Logger(settings);
      }
    } else {
      if (!Logger.instance) {
        throw new Error(`Empty instance. Missing parameters!`);
      }
    }
    return Logger.instance;
  }

  public verbose(msg: string | any) {
    this.winston.verbose(msg);
  }

  public info(msg: string | any) {
    this.winston.info(msg);
  }

  public warn(msg: string | any) {
    this.winston.warn(msg);
  }

  public error(error: string | any) {
    this.winston.error(error);
  }
}
