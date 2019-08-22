import "./pre-runner";
import { Database } from "@core/Database";
import { Logger } from "@core/Logger";
import * as appconfig from "../appconfig";
import * as sm from "source-map-support";
import { TelegramBot } from "@core/bots";
import { ExpressServer } from "@core/servers"
import * as path from "path";

sm.install();

(async function () {
  try {
    //Creating instances
    Logger.getInstance(appconfig.logger);

    const es = new ExpressServer(appconfig, path.join(__dirname, './controllers'));
    es.start();

    // new FacebookBot(appconfig.bot.facebook.token, es).init();
    TelegramBot.getInstance(appconfig.bot.telegram.token).init();

    const db = Database.getInstance(appconfig.database);
    db.injectModels(path.join(__dirname, "./core/models"));

  } catch (error) {
    throw new Error(error.message);
  }
})();
