import { Request } from "express";
import { UserModel } from "@core/models/user.model";
import { createValidator } from "./user.validator";

export class UserController {

  public static async registration(req: Request) {
    if (!createValidator(req.body)) {
      const errorMsg = createValidator.errors.map(er => er.message).join(" ;");
      throw new Error(errorMsg);
    }

    const $user = new UserModel(req.body);
    await $user.save();

    //Todo:Send first email; start funnel;
  }

}
