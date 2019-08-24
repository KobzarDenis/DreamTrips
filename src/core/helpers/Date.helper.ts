export class DateHelper {
  public static getClosestEventDate() {
    return Date.now();
  }

  public static getNextEventDate() {
    return Date.now() + 5;
  }
}
