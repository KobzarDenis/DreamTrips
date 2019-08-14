import { State } from "./State";
import { User } from "./User";
import { IncomingMessage } from "@core/bots/Bot";

export class FirsPointState {

  constructor() {
    // super();
  }

  public async handleAction(user: User, data: IncomingMessage): Promise<void> {
    await this.do(user, data);
  }

  protected async do(user: User, data: IncomingMessage): Promise<void> {
    await user.bot.sendFirst(data);
    //super.changeState(user, this); //ToDo: Create next state!!!
  }

}
