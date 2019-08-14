import * as RU from "./configs/RU";
import * as UA from "./configs/UA";

export enum Phrases {
  GREETING = 'greeting',
  INTRO = 'intro',
  HOW_OFTEN_DO_YOU_TRAVEL = 'how_often_do_you_travel',
  NOT_BAD = 'not_bad',
  COOL = 'cool',
  WOW = 'wow',
  DONT_WORRY = 'dont_worry',
  DO_YOU_WANNA_KNOW_HOW_TO_TRAVEL_MORE = 'do_you_wanna_know_how_to_travel_more',
  DO_YOU_WANNA_TRAVELING_IMPRESSIVE = 'do_you_wanna_traveling_impressive',
  PREPARE_FOR_MAGIC = 'prepare_for_magic',
  OPENING = 'opening',
  VIDEO = 'video',
  INSPIRED_OR_NOT = 'inspired_or_not',
  DO_YOU_WANNA_KNOW_WHO_WE_ARE = 'do_you_wanna_know_who_we_are',
  PRESENTATION_1 = 'presentation1',
  PRESENTATION_2 = 'presentation2',
  PRESENTATION_3 = 'presentation3',
  YOU_KNOW_ABOUT_US = 'you_know_about_us',
  DO_YOU_WANNA_KNOW_MORE_ABOUT_BUSINESS = 'do_you_wanna_know_more_about_business',
  CHOOSE_YOUR_BEST = 'choose_your_best',
  WHY_DID_YOU_DISCARD_IT = 'why_did_you_discard_it',
  ONLY_TRAVELING_MEETING = 'only_traveling_meeting',
  ONLY_BUSINESS_MEETING = 'only_business_meeting',
  BOTH_TRAVELING_AND_BUSINESS_MEETING = 'both_traveling_and_business_meeting',
  ITS_NOT_A_BIG_DEAL = 'its_not_a_big_deal',
  CLOSEST_MEETING = 'closest_meeting',
  SEE_YOU = 'see_you',
  WHY_YOU_WONT_TO_COME = 'why_you_wont_to_come',
  WE_HAVE_MEETINGS_EVERY_WEEK = 'we_have_meetings_every_week',
  LETS_CALL = 'lets_call',
  INPUT_YOUR_CONTACT = 'input_your_contact',
  HOPE_TO_SEE_YOU_NEXT_TIME = 'hope_to_see_you_next_time',
  WE_ARE_GONNA_CONTACT_YOU = 'we_are_gonna_contact_you'
}

export enum Buttons {
  GOGOGO = 'gogogo',
  ONES_PER_YEAR = 'ones_per_year',
  THREE_TIMES_PER_YEAR = 'three_times_per_year',
  MORE_OFTEN = 'more_often',
  HAVE_NEVER_TRAVELING = 'have_never_traveling',
  YES_I_WANT = 'yes_i_want',
  NO_I_KNOW_WHO_YOU_ARE = 'no_i_know_who_you_are',
  HUNDRED_PERCENT = 'hundred_percent',
  FIRST_VARIANT = 'first_variant',
  SECOND_VARIANT = 'second_variant',
  THIRD_VARIANT = 'third_variant',
  TOO_CONFUSING = 'too_confusing',
  NOT_ENOUGH_INFO = 'not_enough_info',
  NOON = 'noon',
  EVENING = 'evening',
  I_WONT_BE_ABLE_AT_THIS_DAY = 'i_wont_be_able_at_this_day',
  I_WONT_BE_ABLE_AT_THIS_TIME = 'i_wont_be_able_at_this_time',
  EMAIL = 'email',
  PHONE_NUMBER = 'phone_number'
}

export enum Langs {
  RU = 'ru',
  UA = 'ua',
}

export class Translator {

  private static readonly phrases = {
    ru: RU.phrases,
    ua: UA.phrases
  };

  private static readonly buttons = {
    ru: RU.buttons,
    ua: UA.buttons
  };

  /**
   * This is method for create message for specific phrase and language
   * with substitution target words in needed place inside the phrase
   * @param {Langs} lang - specific language for translating target phrase
   * @param {Phrases} phraseType - target phrase
   * @param {string[]} words? - words for substitution
   */
  public static getMessage(lang: Langs, phraseType: Phrases, words?: string[]) {
    return Translator.buildMessage(Translator.phrases[lang][phraseType], words);
  }

  /**
   * This is method for translating button text
   * @param lang - specific language for translating target button text
   * @param buttonType - target button
   */
  public static getButtonText(lang: Langs, buttonType: Buttons) {
    return Translator.buttons[lang][buttonType];
  }

  /**
   * Substitution words in phrase, smth like stringBuilder
   * @param {string} phrase - target phrase
   * @param {string[]} words? - words for substitution
   */
  private static buildMessage(phrase: string, words?: any[]) {
    let newPhrase = phrase;

    if(words && words.length) {
      for (let i = 0; i < words.length; i++) {
        newPhrase = newPhrase.replace(`{${i}}`, words[i]);
      }
    }

    return newPhrase;
  }
}
