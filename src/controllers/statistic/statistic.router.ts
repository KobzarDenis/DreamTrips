import { Handler, RequestType } from "@core/servers/types";
import { StatisticController } from "./statistic.controller";

export const routes: Handler[] = [
    { type: RequestType.GET, event: '/api/statistic/manuallyInvited', handler: StatisticController.manuallyInvited }
];