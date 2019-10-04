import { Handler, RequestType } from "@core/servers/types";
import { MeetingController } from "./meeting.controller";

export const routes: Handler[] = [
    { type: RequestType.PUT, event: '/api/meeting/createGoogle', handler: MeetingController.createGoogle },
    { type: RequestType.PUT, event: '/api/meeting/createInternal', handler: MeetingController.createInternal },
    { type: RequestType.PUT, event: '/api/meeting/sendInviteByEmail', handler: MeetingController.sendInviteByEmail },
    { type: RequestType.PUT, event: '/api/meeting/sendInviteBySMS', handler: MeetingController.sendInviteBySMS },
    { type: RequestType.PUT, event: '/api/meeting/sendInviteByBot', handler: MeetingController.sendInviteByBot },
    { type: RequestType.PUT, event: '/api/meeting/sendBulkInvites', handler: MeetingController.sendBulkInvites }
];
