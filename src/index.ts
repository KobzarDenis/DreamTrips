import "./pre-runner";
import { botRelation, stateRelation } from "@core/helpers/Relation.helper";
import { Database } from "@core/Database";
import { Logger } from "@core/Logger";
import { Redis } from "@core/Redis";
import * as appconfig from "../appconfig";
import * as sm from "source-map-support";
import { TelegramBot, FacebookBot, SystemBot, BotName } from "@core/bots";
import { ExpressServer } from "@core/servers"
import * as path from "path";
import { StateHolder } from "@core/fsm";
import {FileManager} from "@core/fileManager";

sm.install();

(async function () {
  try {
    //Creating instances
    Logger.getInstance(appconfig.logger);

    const es = new ExpressServer(appconfig, path.join(__dirname, './controllers'));
    es.start();

    FileManager.init(appconfig.awsCredentials);

    FacebookBot.getInstance(appconfig.bot.facebook.token, es).init();
    TelegramBot.getInstance(appconfig.bot.telegram.token).init();
    SystemBot.getInstance(appconfig.bot.system.token).init();
    Redis.getInstance(appconfig.redis.url);

    const db = Database.getInstance(appconfig.database);
    db.injectModels(path.join(__dirname, "./core/models"));

    botRelation[BotName.Facebook] = FacebookBot.getInstance();
    StateHolder.init(botRelation, stateRelation);

  } catch (error) {
    throw new Error(error.message);
  }
})();
