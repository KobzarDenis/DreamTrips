import { Handler, RequestType } from "@core/servers/types";
import { UserController } from "./user.controller";

export const routes: Handler[] = [
  { type: RequestType.POST, event: '/api/user/signup', handler: UserController.registration },
  { type: RequestType.POST, event: '/api/user/feedback', handler: UserController.feedback }
];