import { Buttons } from "./translator";

export enum Command {
  Start = '/start',
  Help = '/help',
  RemindMe = '/remindme',
  Subscribe = '/subscribe',
  Setup = '/setup'
}

export class Configurator {

  private static readonly buttonValue = {
    [Buttons.GOGOGO]: '/lets-go',
    [Buttons.ONES_PER_YEAR]: '/low-traveler',
    [Buttons.THREE_TIMES_PER_YEAR]: '/mid-traveler',
    [Buttons.MORE_OFTEN]: '/advance-traveler',
    [Buttons.HAVE_NEVER_TRAVELING]: '/no-traveler',
    [Buttons.YES_I_WANT]: '/dont-know-about',
    [Buttons.OFCOURSE]: '/ofcourse',
    [Buttons.SURE]: '/sure',
    [Buttons.ABSOLUTELY]: '/absolutely',
    [Buttons.YES_I_HAVE_A_QUESTION]: '/dont-know-about',
    [Buttons.NO_I_KNOW_WHO_YOU_ARE]: '/know-about',
    [Buttons.HUNDRED_PERCENT]: '/interested-in-business',
    [Buttons.IM_NOT_SURE]: '/not-interested-in-business',
    [Buttons.FIRST_VARIANT]: '/only-traveling',
    [Buttons.SECOND_VARIANT]: '/only-business',
    [Buttons.THIRD_VARIANT]: '/both-traveling-and-business',
    [Buttons.TOO_CONFUSING]: '/confusing',
    [Buttons.NOT_ENOUGH_INFO]: '/too-little-info',
    [Buttons.NOON]: '/noon-meeting',
    [Buttons.EVENING]: '/evening-meeting',
    [Buttons.I_WONT_COMING]: '/i-wont-coming',
    [Buttons.I_WONT_BE_ABLE_AT_THIS_DAY]: '/not-that-day',
    [Buttons.I_WONT_BE_ABLE_AT_THIS_TIME]: '/not-that-time',
    [Buttons.EMAIL]: '/email',
    [Buttons.PHONE_NUMBER]: '/phone-number'
  };

  public static getButtonValue(buttonType: Buttons) {
    return Configurator.buttonValue[buttonType];
  }
}
