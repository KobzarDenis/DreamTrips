import * as redis from "redis";
import * as bluebird from "bluebird";

export class Redis {

  private static _instance: Redis;
  private client: redis.RedisClient;
  public static readonly DAY_TTL = 60 * 60 * 24;
  public static readonly WEEK_TTL = 60 * 60 * 24 * 7;
  public static readonly MONTH_TTL = 60 * 60 * 24 * 7 * 30;
  public static readonly HALF_YEAR_TTL = 60 * 60 * 24 * 7 * 30 * 6;

  private constructor(url: string) {
    bluebird.promisifyAll(redis.RedisClient.prototype);
    bluebird.promisifyAll(redis.Multi.prototype);
    this.client = redis.createClient(url);
  }

  public static getInstance(url?: string): Redis {
    if (!Redis._instance) {
      if (!url) {
        throw new Error(`Missing parameters!`);
      }

      Redis._instance = new Redis(url);
    }

    return Redis._instance;
  }

  public async getItem(key: string) {
    return await this.client.getAsync(key);
  }

  public async setItem(key: string, value: string, expirationSec: number = Redis.DAY_TTL) {
    return await this.client.set(key, value, 'EX', expirationSec);
  }

  public async removeItem(key: string) {
    return await this.client.delAsync(key);
  }

  public async getAllKeys(): Promise<string[]> {
    const keys = await this.client.keysAsync('*');
    return keys;
  }

}
