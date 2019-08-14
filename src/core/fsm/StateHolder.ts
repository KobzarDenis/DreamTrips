import { User } from "@core/fsm/User";

export class StateHolder {
  private static usersPool: Map<string, User> = new Map<string, User>();

  public static getUser(key: string): User {
    return <User> StateHolder.usersPool.get(key);
  }

  public static setUser(key: string, user: User) {
    return StateHolder.usersPool.set(key, user);
  }
}
