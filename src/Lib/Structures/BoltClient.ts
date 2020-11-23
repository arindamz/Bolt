import {
  AkairoClient,
  CommandHandler,
  Flag,
  InhibitorHandler,
  ListenerHandler,
} from 'discord-akairo';
import { Util } from 'discord.js';
import Node from 'lavaqueue';
import { join } from 'path';
import Storage from 'rejects';
import { Connection } from 'typeorm';
import { Playlist, Setting } from '../Database/Models';
import database from '../Database/Database';
import TypeORMProvider from '../Database/SettingsProvider';

import type { ExtendedRedis } from 'lavaqueue/typings/QueueStore';

export default class BoltClient extends AkairoClient {
  public root: string;

  public db!: Connection;

  public settings!: TypeORMProvider;

  public music = new Node({
    userID: this.config.lavalink.id,
    password: this.config.lavalink.password,
    hosts: {
      rest: this.config.lavalink.hosts.rest,
      ws: this.config.lavalink.hosts.ws,
      redis: this.config.lavalink.hosts.redis
        ? {
            port: 6379,
            host: this.config.lavalink.hosts.redis,
            db: 0,
          }
        : undefined,
    },
    send: async (guild, packet): Promise<void> => {
      const shardGuild = this.guilds.cache.get(guild);
      if (shardGuild) return shardGuild.shard.send(packet);
      return Promise.resolve();
    },
  });

  public redis = this.music.queues.redis;

  public storage = new Storage(this.redis);

  public commandHandler = new CommandHandler(this, {
    directory: join(__dirname, '..', '..', 'Commands'),
    prefix: [
      '🎶',
      '🎵',
      '🎼',
      '🎹',
      '🎺',
      '🎻',
      '🎷',
      '🎸',
      '🎤',
      '🎧',
      '🥁',
      (this.config.prefix as string) ?? 'b!',
    ].flat(),
    aliasReplacement: /-/g,
    allowMention: true,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    defaultCooldown: 3000,
    argumentDefaults: {
      prompt: {
        modifyStart: (_, str): string =>
          `${str}\n\nType \`cancel\` to cancel the command.`,
        modifyRetry: (_, str): string =>
          `${str}\n\nType \`cancel\` to cancel the command.`,
        timeout: 'Guess you took too long, the command has been cancelled.',
        ended:
          "More than 3 tries and you still didn't quite get it. The command has been cancelled",
        cancel: 'The command has been cancelled.',
        retries: 3,
        time: 30000,
      },
      otherwise: '',
    },
  });

  public inhibitorHandler = new InhibitorHandler(this, {
    directory: join(__dirname, '..', '..', 'Inhibitors'),
  });

  public listenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, '..', '..', 'Events'),
  });

  public constructor(config: BoltOptions) {
    super({
      ownerID: config.owner,
      disableMentions: 'everyone',
    });
    this.root = config.root;

    this.commandHandler.resolver.addType(
      'playlist',
      async (message, phrase) => {
        if (!phrase) return Flag.fail(phrase);
        phrase = Util.cleanContent(phrase.toLowerCase(), message);
        const playlistRepo = this.db.getRepository(Playlist);
        const playlist = await playlistRepo.findOne({
          name: phrase,
          guild: message.guild!.id,
        });

        return playlist || Flag.fail(phrase);
      }
    );
    this.commandHandler.resolver.addType(
      'existingPlaylist',
      async (message, phrase) => {
        if (!phrase) return Flag.fail(phrase);
        phrase = Util.cleanContent(phrase.toLowerCase(), message);
        const playlistRepo = this.db.getRepository(Playlist);
        const playlist = await playlistRepo.findOne({
          name: phrase,
          guild: message.guild!.id,
        });

        return playlist ? Flag.fail(phrase) : phrase;
      }
    );

    this.config = config;

    process.on('unhandledRejection', (err: any) =>
      console.error(`[UNHANDLED REJECTION] ${err.message}`, err.stack)
    );
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private async _init() {
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler,
    });

    this.commandHandler.loadAll();
    this.inhibitorHandler.loadAll();
    this.listenerHandler.loadAll();

    this.db = database.get('bolt');
    await this.db.connect();
    this.settings = new TypeORMProvider(this.db.getRepository(Setting));
    await this.settings.init();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public async start() {
    await this._init();
    return this.login(this.config.token);
  }
}

declare module 'discord-akairo' {
  interface AkairoClient {
    db: Connection;
    settings: TypeORMProvider;
    music: Node;
    redis: ExtendedRedis;
    storage: Storage;
    config: BoltOptions;
  }
}

interface BoltOptions {
  owner?: string | string[];
  token?: string;
  prefix?: string | string[];
  root: string;
  lavalink: {
    id: string;
    password: string;
    hosts: {
      rest: string;
      ws: string;
      redis: string;
    };
  };
}
