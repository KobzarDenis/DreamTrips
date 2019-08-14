import { User } from "@core/fsm/User";

export class StateHolder {
  private static usersPool: { [key: string]: User } = {};

  public static getUser(key: string): User {
    return StateHolder.usersPool[key];
  }

  public static setUser(key: string, user: User) {
    return StateHolder.usersPool[key] = user;
  }
}
