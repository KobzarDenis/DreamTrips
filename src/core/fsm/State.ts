import { User } from "./User";
import { IncomingMessage } from "@core/bots/Bot";

export enum StateName {
  Greeting = 'greeting'
}

export abstract class State {

  // /**
  //  * State Factory
  //  * Create and return state depend on name
  //  * @param {StateName} stateName - name of needed state
  //  * @return {State}
  //  */
  // public static createState(stateName: StateName): State {
  //   let state: State;
  //
  //   switch (stateName) {
  //     case StateName.Greeting:
  //     default:
  //       state = new GreetingState();
  //       break;
  //   }
  //
  //   return state;
  // }

  /**
   * Handle user's action from one state to another
   * @param {User} user - instance of user
   */
  public abstract async handleAction(user: User, data: IncomingMessage): Promise<void>;

  /**
   * Do action on current state
   * @param {User} user - instance of user
   * @return {Promise<void>}
   */
  protected async abstract do(user: User, data: IncomingMessage): Promise<void>;

  /**
   * Change user's state after action
   * @param {User} user - instance of user
   * @param {State} newState - instance of state
   */
  protected changeState(user: User, newState: State): void {
    user.setState(newState);
  }

}
