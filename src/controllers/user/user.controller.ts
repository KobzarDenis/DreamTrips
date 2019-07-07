import { Request } from "express";
import { User } from "@core/models/user.model";
import { createValidator } from "./user.validator";

export class UserController {

  public static async registration(req: Request) {
    if (!createValidator(req.body)) {
      const errorMsg = createValidator.errors.map(er => er.message).join(" ;");
      throw new Error(errorMsg);
    }

    const $user = new User(req.body);
    await $user.save();

    //Todo:Send first email; start funnel;
  }

}
