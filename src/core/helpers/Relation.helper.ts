import * as states from "../fsm/states";
import * as bots from "../bots";
import * as appconfig from "../../../appconfig";

export const stateRelation = {
  [states.StateName.Greeting]: states.GreetingState.getInstance(),
  [states.StateName.Entry]: states.EntryState.getInstance(),
  [states.StateName.AttractionFirst]: states.AttractionFirstState.getInstance(),
  [states.StateName.AttractionSecond]: states.AttractionSecondState.getInstance(),
  [states.StateName.Intro]: states.IntroState.getInstance()
};

export const botRelation = {
  [bots.BotName.Telegram]: bots.TelegramBot.getInstance(appconfig.bot.telegram.token)
};
