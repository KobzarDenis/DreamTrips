export class DateHelper {

  public static getClosestEventDate() {
    const date = new Date();
    date.setDate(date.getDate() + (6 + 7 - date.getDay()) % 7);

    return date;
  }

  public static getNextEventDate() {
    const date = new Date();
    date.setDate(date.getDate() + (6 + 7 - date.getDay()) % 14);

    return date;
  }
}
