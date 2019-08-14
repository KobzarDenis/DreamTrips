import { State } from "./State";
import { User } from "./User";
import { IncomingMessage } from "@core/bots/Bot";
import { FirsPointState } from "@core/fsm/FirsPoint.state";

export class GreetingState extends State{

  constructor() {
    super();
  }

  public async handleAction(user: User, data: IncomingMessage): Promise<void> {
    await this.do(user, data);
  }

  protected async do(user: User, data: IncomingMessage): Promise<void> {
    await user.bot.sendGreeting(data);
    super.changeState(user, new FirsPointState()); //ToDo: Create next state!!!
  }

}
