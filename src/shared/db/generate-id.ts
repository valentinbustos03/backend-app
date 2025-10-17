import { Snowflake } from '@sapphire/snowflake';

const TWITTER_EPOCH = 1288834974657n;

const snowflake = new Snowflake(TWITTER_EPOCH);

export default function generateId(): string {
  return snowflake.generate().toString();
}
