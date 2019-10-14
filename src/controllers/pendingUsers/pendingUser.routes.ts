import { Handler, RequestType } from "@core/servers/types";
import { PendingUserController } from "./pendingUser.controller";

export const routes: Handler[] = [
    { type: RequestType.GET, event: '/api/pendingUsers/list', handler: PendingUserController.list }
];
