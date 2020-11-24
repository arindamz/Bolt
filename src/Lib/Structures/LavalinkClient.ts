import { Client } from 'lavaqueue';
import { Collection } from 'discord.js';
import BoltClient from './BoltClient';
import { floatPromise } from '../Utils/floatPromise';

export default class extends Client {
  public client: BoltClient;

  public info = {
    feed: new Collection<string, any>(),
    loop: new Collection<string, any>(),
    votes: new Collection<any, any>(),
  };

  public constructor(client: BoltClient) {
    super({
      userID: client.config.lavalink.id,
      password: client.config.lavalink.password,
      hosts: {
        rest: client.config.lavalink.hosts.rest,
        ws: client.config.lavalink.hosts.ws,
        redis: client.config.lavalink.hosts.redis
          ? {
              port: 6379,
              host: client.config.lavalink.hosts.redis,
              db: 0,
            }
          : undefined,
      },
      send: (guildID, packet) => {
        const shardGuild = client.guilds.cache.get(guildID);
        if (shardGuild) return shardGuild.shard.send(packet);
        return Promise.resolve();
      },
      advanceBy: (queue, { previous }) => {
        if (this.info.loop.get(queue.guildID)) {
          floatPromise({ client: this.client }, queue.add(previous));
          return 0;
        }
        return 1;
      },
    });

    this.client = client;
  }
}
