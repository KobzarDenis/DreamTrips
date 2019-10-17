import appconfig from "@config";
import * as moment from "moment";

export class DateHelper {

  public static getClosestEventDate(time?: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + (6 + 7 - date.getDay()) % 7);
    date.setHours(time ||  <number> appconfig.meeting.noonTime, 0, 0);

    return date;
  }

  public static getNextEventDate(time?: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + (6 + 7 - date.getDay()) % 14);
    date.setHours(time ||  <number> appconfig.meeting.eveningTime, 0, 0);

    return date;
  }

  public static getTimeNHourAgo(n: number): string {
      return moment().subtract(n,"hours").format("YYYY-MM-DD HH:mm:ss");
  }

  public static formatToDateAndTime(date: Date): string {
    return moment(date).format("YYYY-MM-DD HH-MM");
  }

  public static formatToDateOnly(date: Date): string {
    return moment(date).format("YYYY-MM-DD");
  }

  public static getDateAndTimeForEvent(part: string): string {
    const time = part === "noon" ? <number> appconfig.meeting.noonTime : <number> appconfig.meeting.eveningTime;
    const date = this.getClosestEventDate(<number> appconfig.meeting.noonTime);

    return this.formatToDateAndTime(date);
  }
}
