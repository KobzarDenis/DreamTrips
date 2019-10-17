import * as bots from "../bots";
import * as states from "../fsm/states";
import appconfig from "@config";

export const stateRelation = {
  [states.StateName.Greeting]: states.GreetingState.getInstance(),
  [states.StateName.Entry]: states.EntryState.getInstance(),
  [states.StateName.AttractionFirst]: states.AttractionFirstState.getInstance(),
  [states.StateName.AttractionSecond]: states.AttractionSecondState.getInstance(),
  [states.StateName.Intro]: states.IntroState.getInstance(),
  [states.StateName.WhoWeAre]: states.WhoWeAreState.getInstance(),
  [states.StateName.Presentation]: states.PresentationState.getInstance(),
  [states.StateName.ChoseVariant]: states.ChoseVariantState.getInstance(),
  [states.StateName.Objections]: states.ObjectionsState.getInstance(),
  [states.StateName.Invitation]: states.InvitaionState.getInstance(),
  [states.StateName.Acception]: states.AcceptionState.getInstance(),
  [states.StateName.ManualInvite]: states.ManualInviteState.getInstance(),
  [states.StateName.Finish]: states.FinishState.getInstance(),
  [states.StateName.ContactCollection]: states.ContactCollectionState.getInstance()
};

export const botRelation = {
  [bots.BotName.Telegram]: bots.TelegramBot.getInstance(appconfig.bot.telegram.token),
  // [bots.BotName.Facebook]: null
};
