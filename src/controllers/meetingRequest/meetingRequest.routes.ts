import { Handler, RequestType } from "@core/servers/types";
import { MeetingRequestController } from "./meetingRequest.controller";

export const routes: Handler[] = [
    { type: RequestType.GET, event: '/api/meetingRequest', handler: MeetingRequestController.list },
    { type: RequestType.PUT, event: '/api/meetingRequest', handler: MeetingRequestController.create },
    { type: RequestType.DELETE, event: '/api/meetingRequest', handler: MeetingRequestController.delete },
    { type: RequestType.POST, event: '/api/meetingRequest', handler: MeetingRequestController.update }
];
