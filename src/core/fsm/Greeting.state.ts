import { State } from "./State";
import { User } from "./User";

export class GreetingState extends State {

  constructor() {
    super();
  }

  public handleAction(user: User): void {

  }

  protected async do(user: User): Promise<void> {
    await user.bot.sendGreeting(user.name);
    super.changeState(user, this); //ToDo: Create next state!!!
  }

}
