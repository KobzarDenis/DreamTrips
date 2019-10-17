import appconfig from "@config";

export class DateHelper {

  public static getClosestEventDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + (6 + 7 - date.getDay()) % 7);
    date.setHours(<number> appconfig.meeting.noonTime, 0, 0);

    return date;
  }

  public static getNextEventDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + (6 + 7 - date.getDay()) % 14);
    date.setHours(<number> appconfig.meeting.eveningTime, 0, 0);

    return date;
  }
}
