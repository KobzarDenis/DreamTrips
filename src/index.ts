import "./pre-runner";
import { Database } from "@core/Database";
import { Logger } from "@core/Logger";
import * as appconfig from "../appconfig";
import * as sm from "source-map-support";
import { TelegramBot } from "@core/bots/Telegram.bot";
import { FacebookBot } from "@core/bots/Facebook.bot";
import { ExpressServer } from "@core/servers/Express.server"

sm.install();

(async function () {
  try {
    //Creating instances
    Logger.getInstance(appconfig.logger);

    const es = new ExpressServer();
    es.start();

    new FacebookBot(appconfig.bot.facebook.token, es).init();
    new TelegramBot(appconfig.bot.telegram.token).init();

    const db = Database.getInstance(appconfig.database);

    // db.injectModels(path.join(__dirname, "./core/models"));

  } catch (error) {
    throw new Error(error.message);
  }
})();
