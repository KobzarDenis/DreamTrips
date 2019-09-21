import { Request } from "express";
import { UserModel } from "@core/models/user.model";
import { createValidator, feedbackValidator } from "./user.validator";
import {Logger} from "@core/Logger";

export class UserController {

  public static async registration(req: Request) {
    if (!createValidator(req.body)) {
      const errorMsg = createValidator.errors.map(er => er.message).join(" ;");
      throw new Error(errorMsg);
    }

    Logger.getInstance().info(`New signUp: ${req.body.firstName} | ${req.body.phoneNumber}`);

    const $user = new UserModel(req.body);
    await $user.save();

    return {uuid: $user.uuid};
    //Todo:Send first email; start funnel;
  }

  public static async feedback(req: Request) {
    if (!feedbackValidator(req.body)) {
      const errorMsg = feedbackValidator.errors.map(er => er.message).join(" ;");
      throw new Error(errorMsg);
    }

    Logger.getInstance().info(`New question: ${req.body.question}`);
  }

}
