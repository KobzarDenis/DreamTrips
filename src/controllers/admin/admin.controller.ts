import { Request } from "express";
import { AdminModel } from "@core/models/admin.model";
import { loginValidator } from "./admin.validator";
import {Logger} from "@core/Logger";
import {ValidationError} from "@core/errors";

export class AdminController {

  public static async signIn(req: Request) {
    if (!loginValidator(req.body)) {
      throw new ValidationError(loginValidator.errors);
    }

    Logger.getInstance().info(`Admin login: [${req.body.email}]`);

    const $admin = await AdminModel.findOne({where: {email: req.body.email, password: req.body.password}});

    return $admin;
  }

}
