import { Request } from "express";
import { UserModel } from "@core/models/user.model";
import { createValidator, feedbackValidator } from "./user.validator";
import {Logger} from "@core/Logger";
import {ValidationError} from "@core/errors";

export class UserController {

  public static async registration(req: Request) {
    if (!createValidator(req.body)) {
      throw new ValidationError(createValidator.errors);
    }

    Logger.getInstance().info(`New signUp: ${req.body.firstName} | ${req.body.phoneNumber}`);

    const $user = new UserModel(req.body);
    await $user.save();

    return {uuid: $user.uuid};
    //Todo:Send first email; start funnel;
  }

  public static async feedback(req: Request) {
    if (!feedbackValidator(req.body)) {
      throw new ValidationError(feedbackValidator.errors);
    }

    Logger.getInstance().info(`New question: ${req.body.question}`);
  }

}
