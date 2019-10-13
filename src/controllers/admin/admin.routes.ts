import { Handler, RequestType } from "@core/servers/types";
import { AdminController } from "./admin.controller";

export const routes: Handler[] = [
  { type: RequestType.POST, event: '/api/admin/signin', handler: AdminController.signIn },
];
