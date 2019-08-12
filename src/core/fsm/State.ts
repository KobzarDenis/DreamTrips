import { User } from "./User";

export abstract class State {

  /**
   * Handle user's action from one state to another
   * @param {User} user - instance of user
   */
  public abstract handleAction(user: User): void;

  /**
   * Do action on current state
   * @param {User} user - instance of user
   * @return {Promise<void>}
   */
  protected async abstract do(user: User): Promise<void>;

  /**
   * Change user's state after action
   * @param {User} user - instance of user
   * @param {State} newState - instance of state
   */
  protected changeState(user: User, newState: State): void {
    user.setState(newState);
  }

}
